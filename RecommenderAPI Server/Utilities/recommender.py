import pandas as pd
import numpy as np
import scipy.sparse
from scipy import sparse
from lightfm import LightFM
from lightfm.data import Dataset
from pandas import DataFrame
from pymongo import MongoClient
from sklearn.neighbors import NearestNeighbors
from colorama import Fore, Style
from usermetadata import UserMetaData
from gamemetadata import GameMetaData
from usergamemetadata import UserGameMetaData
from customerrors import ValidationError

user_meta_data = UserMetaData()
game_meta_data = GameMetaData()
user_game_meta_data = UserGameMetaData()


# [DONE] TODO5: Add functionality to allow refreshing of Recommender data.
# TODO 6: Add .env method.
# TODO 7: Modify user game recommendation methods to ensure that the games user owns are not recommended. Check for the
#   owned games from the database.


class Recommender:
    """
    Provides recommendations for various types of queries.
    """

    # ---- Magic Methods ----
    def __init__(
            self,
            def_count: int = 5,
            no_components: int = 20,
            loss_function: str = 'warp',
            epochs: int = 30,
            n_jobs_mf: int = 4,
            n_jobs_nn: int = 1,
            use_weights: bool = False,
            use_item_feature_matrix: bool = False,
            use_user_feature_matrix: bool = False,
            nn_distance_metric: str = 'cosine'
    ):
        """
        Initializes the recommender.

        :param def_count: The default upper limit on the number of recommendations to provide.
        :param no_components: Number of embeddings to be created in the lightFM (Matrix Factorization) model
            to define items and users.
        :param loss_function: The loss function to use in the lightFM (Matrix Factorization) model.
        :param epochs: The number of epochs to run in the lightFM (Matrix Factorization) model.
        :param n_jobs_mf: Number of parallel computation threads to use in the lightFM (Matrix Factorization) model.
            Shouldn't be higher than the number of physical cores.
        :param n_jobs_nn: Number of parallel computation threads to use in the NearestNeighbors model.
            Shouldn't be higher than the number of physical cores. -1 means use all available cores.
        :param use_weights: If true, the interaction's weights' matrix will be used in training the
            lightFM (Matrix Factorization) model.
        :param use_item_feature_matrix: If true, the item features' matrix will be used in training the
            lightFM (Matrix Factorization) model.
        :param use_user_feature_matrix: If true, the user features' matrix will be used in training the
            lightFM (Matrix Factorization) model.
        :param nn_distance_metric: The distance metric to use in neighbor searches.
        """

        self._log('Initializing Constants...')
        self.def_count = def_count
        self.no_components = no_components
        self.loss_function = loss_function
        self.epochs = epochs
        self.n_jobs_mf = n_jobs_mf
        self.n_jobs_nn = n_jobs_nn
        self.use_weights = use_weights
        self.use_item_feature_matrix = use_item_feature_matrix
        self.use_user_feature_matrix = use_user_feature_matrix
        self.nn_distance_metric = nn_distance_metric
        self._log('Constants Initialized')

        self._log('Fetching Data...')
        self._get_data()
        self._log('Data Fetched')

        self._log('Validating Constants...')
        if self.def_count > self.user_count or self.def_count > self.item_count:
            self._log(
                'Default count for recommendations exceeds number of available users or items.',
                lvl=3
            )
            raise ValidationError('Invalid value for def_count provided. Check recommender logs for details.')
        self._log('Constants Validated')

        self._log('Training Models...')
        self._build_and_set_lightfm_based_model()
        self._build_and_set_nn_user_feature_model()
        self._build_and_set_nn_item_feature_model()
        self._build_and_set_nn_item_genre_lang_model()
        self._log('Models Trained')

        self._log('Recommender Initialized')

    # ---- Public Methods ----
    def get_user_game_recs(self, uid: int, k=None) -> dict:
        """
        Inputs a user id and returns at most 'k' game recommendations for that user.

        :return: A dictionary of 3 lists: One containing game recommendations for the user on the basis of user profile
            (content - based recommendations), second containing game recommendations for the user on the basis of
            choices of similar users (collaborative filtering based recommendations), the third contains the games that
            the user owns. All lists have the most recommended game first.
        """
        # ---- Assign default value to 'k', if it is not specified ----
        if (not k) or (type(k) != int):
            k = self.def_count
        if k > self.item_count:
            k = self.def_count
        return {
            'profile_based': self._get_user_item_nn_based_recs(
                uid=uid,
                k=k
            ),
            'similar_user_based': self._get_user_item_mf_based_recs(
                user_id=uid,
                threshold=0.7,
                k=k
            ) if uid in self.user_id_dict_inverted.keys() else [],
            'owned': self._get_games_owned_by_user(
                uid=uid
            )
        }

    def get_user_user_recs(self, uid: int, k=None) -> list:
        """
        Inputs a user id and returns at most 'k' related users for that user.

        :return: A list containing the related users for a user, with the most related user first.
        """
        # ---- Assign default value to 'k', if it is not specified ----
        if (not k) or (type(k) != int):
            k = self.def_count
        if k > self.user_count:
            k = self.def_count
        return self._get_user_user_nn_based_recs(
            uid=uid,
            k=k
        )

    def get_game_game_recs(self, game_id: int, k=None) -> list:
        """
        Inputs a game id and returns at most 'k' related games for that game.

        :return: A list containing the games similar to a given game, with the most similar games first.
        """
        # ---- Assign default value to 'k', if it is not specified ----
        if (not k) or (type(k) != int):
            k = self.def_count
        if k > self.item_count:
            k = self.def_count
        return self._get_item_item_nn_based_recs(
            game_id=game_id,
            k=k
        )

    def get_games_by_genre(self, uid: int, genres: list, merge_by_and: bool = True, k=None) -> list:
        """
        Inputs a user id, a genre list, and a merge_by_and parameter. Returns at most 'k' related games to the user,
        from amongst the games having the supplied genres, as per the merge_by_and.
        Note: languages are also treated as genres, so, this method works for language based recommendations as well.

        :param uid: The id of the user to recommend to.
        :param genres: The list of genres to use to recommend.
        :param merge_by_and: If true, all genres must be present in the game, else, at least one of the genres.
        :param k: The number of recommendations.
        :return: A list containing the most similar games, with the most relevant game first.
        """
        # ---- Assign default value to 'k', if it is not specified ----
        if (not k) or (type(k) != int):
            k = self.def_count

        return self._get_user_item_genre_nn_based_recs(
            uid=uid,
            genres=genres,
            merge_by_and=merge_by_and,
            k=k
        )

    def refresh_model_data(self):
        self._log('Refreshing Model Data', lvl=2)
        self._refresh_model()

    # ---- Utilities ----
    @staticmethod
    def _get_dataframe_from_collection(collection, remove_id: bool = True) -> DataFrame:
        """
        Converts a MongoDB collection to a dataframe. Assumes the attributes (column names) of all the documents in the
        collection are identical.

        :rtype: DataFrame
        :type remove_id: bool
        :param collection: A pymongo collection object, referring to the collection to be retrieved as a dataframe.
        :param remove_id: If true, forcibly removes the '_id' column, if it exists.
        :return: A Pandas DataFrame with all documents from the provided collection as the rows. The parameters of the first document are the assumed column names.
        """

        # Get the data from collection, as a list
        raw_collection_data = list(collection.find())

        # Convert raw data to a DataFrame
        df: DataFrame = pd.DataFrame(raw_collection_data)

        # Remove '_id' column if needed, provided the column exists
        if remove_id and ('_id' in df.columns):
            df = df.drop(['_id'], axis=1)
        return df

    @staticmethod
    def _invert_dict(d: dict) -> dict:
        """
        Inverses a provided dictionary. All values must be unique. In case of same values, behaviour is undefined. Throws
        exception if any value is mutable.

        :param d: A dictionary with unique values.
        :return: The inverted dictionary.
        """
        return dict(
            [(val, key) for key, val in d.items()]
        )

    @staticmethod
    def _log(msg: str, lvl: int = 1) -> None:
        """
        Logs any message to console. Provides 3 criticality levels, 1 -> low, 2 -> medium, 3 -> high. Any other value
        is treated as low.

        :param msg: The message to print.
        :param lvl: The criticality level.
        :return: Returns nothing.
        """
        if lvl == 3:
            print(f"{Fore.RED}Recommender: {msg}{Style.RESET_ALL}")
        elif lvl == 2:
            print(f"{Fore.YELLOW}Recommender: {msg}{Style.RESET_ALL}")
        else:
            print(f"Recommender: {msg}")

    def _get_item_embeddings(self) -> scipy.sparse.csr_matrix:
        """
        Get the item embeddings matrix from a lightFM based model.

        :return: The item embedding matrix from the model as a sparse CSR matrix [samples , features]
        """
        model = self.mf_model
        latent_vector_item_features = sparse.csr_matrix(model.item_embeddings)
        return latent_vector_item_features

    def _get_user_embeddings(self) -> scipy.sparse.csr_matrix:
        """
        Get the user embeddings matrix from a lightFM based model.

        :return: The user embedding matrix from the model as a sparse CSR matrix [samples , features]
        """
        model = self.mf_model
        latent_vector_user_features = sparse.csr_matrix(model.user_embeddings)
        return latent_vector_user_features

    @staticmethod
    def _generate_profile_vector(internal_id: int, feature_matrix) -> list:
        """
        Retrieves the profile vector for an item or a user, based on input feature matrix.

        :param internal_id: The internal id for the item or user.
        :param feature_matrix: The feature matrix containing all the item/user data
        :return: The item/user profile vector as a list.
        """
        if scipy.sparse.issparse(feature_matrix):
            feature_matrix = feature_matrix.toarray()
        return list(feature_matrix[internal_id])

    @staticmethod
    def _get_mongodb_query_from_genres(genres: list, merge_by_and: bool) -> dict:
        """
        Inputs a set of genres, and a 'merge_by_and' parameter. Returns a valid MongoDB search query for the inputs.

        :return: A dictionary for a valid search query.
        """
        if merge_by_and:
            query = {}
            for genre in genres:
                query[genre] = 1
            return query
        else:
            return {
                '$or': [
                    {
                        x: 1
                    } for x in genres
                ]
            }

    @staticmethod
    def _convert_id_list_to_dict(id_list):
        """
        Takes a list of system ids for users or games. Returns a dictionary mapping the indices (internal ids) to the
        system ids, i.e., {internal_id -> system_id}.

        :param id_list: The list of system ids. Any iterable.
        :return: A dictionary mapping the indices (internal ids) to the system ids, i.e., {internal_id -> system_id}.
        """
        return pd.Series(id_list).to_dict()

    @staticmethod
    def _get_nearest_neighbor_estimator(feature_matrix, metric: str = 'cosine', n_jobs: int = 1) -> NearestNeighbors:
        """
        Builds and trains a nearest neighbor estimator for implementing neighbor searches.

        :param feature_matrix: The matrix that supplies the training data. Must be of the form [n_samples, m_features].
        :param metric: The distance metric to use.
        :param n_jobs: The number of parallel computations to do. -1 means use all available cores.
        :return: A fitted nearest neighbor estimator.
        """
        nbrs = NearestNeighbors(
            metric=metric,
            n_jobs=n_jobs
        ).fit(
            feature_matrix
        )
        return nbrs

    @staticmethod
    def _get_k_neighbors(points, points_id_dict: dict, estimator: NearestNeighbors, k: int = 5, omit_first: bool = False):
        """
        Takes a set of points (profile vectors) and returns 'k' the nearest neighbors of each point.

        :param points: The list of profiles vectors to find nearest neighbors to.
        :param points_id_dict: A dictionary mapping the internal ids to the external ids, i.e., system ids.
        :param estimator: The NearestNeighbor estimator to use.
        :param k: The number of recommendations to give.
        :param omit_first: Whether to skip the first recommendation. Use in cases where user - user or item - item
            recommendations are being made, to prevent a point being recommended to itself.
        :return: A list of lists of (system) ids of the neighbors of the points provided, in the same order in which
            points are given.
        """
        neigh = estimator.kneighbors(
            points,
            n_neighbors=(k + 1 if omit_first else k),  # if omit_first, k + 1 recs needed as we only take the last k (first rec is the point itself)
            return_distance=False
        )
        return [[points_id_dict[x] for x in st[(1 if omit_first else 0):]] for st in neigh]

    def _refresh_model(self) -> None:
        self._log('Re - Fetching Data...')
        self._get_data()
        self._log('Data Re - Fetched')

        self._log('Re - Training Models...')
        self._build_and_set_lightfm_based_model()
        self._build_and_set_nn_user_feature_model()
        self._build_and_set_nn_item_feature_model()
        self._build_and_set_nn_item_genre_lang_model()
        self._log('Models Re - Trained')

    # ---- Private Model - Based Methods ----
    def _get_data(self) -> None:
        """
        Obtain data from database. This function is the only point of contact between recommender model and database as
        a whole.
        Stores the data with the following names:

            - **external_user_ids**: A list containing the ids of the users used externally, i.e., in the system and database

            - **external_item_ids**: A list containing the ids of the games used externally, i.e., in the system and database

            - **user_id_dict**: A dictionary mapping all user ids used internally to the system user ids, can be inverted. {internal_user_id -> system_user_id}

            - **item_id_dict**: A dictionary mapping all game ids used internally to the system game ids, can be inverted. {internal_game_id -> system_game_id}

            - **user_id_dict_inverted**: A dictionary mapping all user ids used in the system to the user ids used internally, can be inverted. {system_user_id -> internal_user_id}

            - **item_id_dict_inverted**: A dictionary mapping all game ids used in the system to the game ids used internally, can be inverted. {system_game_id -> internal_game_id}

            - **interactions**: The interactions matrix. Stored as a scipy sparse COO matrix.

            - **weights**: The weights matrix. Stored as a scipy sparse COO matrix.

            - **item_feature_matrix**: The matrix containing item features. Stored as a scipy sparse CSR matrix.

            - **user_feature_matrix**: The matrix containing user features. Stored as a scipy sparse CSR matrix.

            - **item_profile_matrix**: The matrix containing unprocessed item features. Stored as a scipy sparse CSR matrix.

            - **item_genre_lang_matrix**: The matrix containing unprocessed item genres and languages only. Stored as a scipy sparse CSR matrix.

            - **user_profile_matrix**: The matrix containing unprocessed user features. Stored as a scipy sparse CSR matrix.

        :return: This function doesn't return anything.
        :rtype: None
        """

        # ---- Establishing Connection to DataBase ----
        client = MongoClient('mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/')
        db = client.recommenderDB
        self.client = client
        self.recommenderDB = db
        self.allUserData = db.allUserData
        self.gameFeatures = db.gameFeatures
        self.userGameInteractions = db.userGameInteractions
        self.allGameData = db.allGameData

        # ---- Converting MongoDB Collections to DataFrames ----
        user_game_interactions = self._get_dataframe_from_collection(db.userGameInteractions)
        game_features = self._get_dataframe_from_collection(db.gameFeatures)
        user_features = self._get_dataframe_from_collection(db.allUserData)

        # ---- User Specific Data ----
        external_user_ids = list(user_features['uid'])
        user_id_dict = user_features['uid'].to_dict()  # {internal_user_id -> system_user_id}
        user_feature_param_list = list(user_features.set_index('uid').columns)

        # ---- Game Specific Data ----
        external_item_ids = list(game_features['id'])
        item_id_dict = game_features['id'].to_dict()  # {internal_item_id -> system_item_id}
        item_feature_param_list = list(game_features.set_index('id').columns)

        # ---- Creating Dataset ----
        dataset = Dataset()
        dataset.fit(
            users=external_user_ids,
            items=external_item_ids,
            item_features=item_feature_param_list,
            user_features=user_feature_param_list
        )

        # ---- Creating Interactions and Weight Matrices ----
        (interactions, weights) = dataset.build_interactions(
            user_game_interactions.to_numpy()
        )

        # ---- Creating Item Feature Matrix ----
        game_features_with_id_as_index = game_features.set_index('id')
        item_feature_matrix = dataset.build_item_features(
            [
                (i, j) for i, j in
                zip(game_features_with_id_as_index.index, game_features_with_id_as_index.to_dict('records'))
            ]
        )

        # ---- Creating User Feature Matrix ----
        user_features_with_uid_as_index = user_features.set_index('uid')
        user_feature_matrix = dataset.build_user_features(
            [
                (i, j) for i, j in
                zip(user_features_with_uid_as_index.index, user_features_with_uid_as_index.to_dict('records'))
            ]
        )

        # ---- Creating Item Profile Matrix ----
        item_profile_matrix = sparse.csr_matrix(game_features[
                                                    game_meta_data.game_specific_info +
                                                    game_meta_data.genres +
                                                    game_meta_data.languages
                                                    ].to_numpy())
        item_genre_lang_matrix = sparse.csr_matrix(
            game_features[game_meta_data.genres + game_meta_data.languages].to_numpy())

        # ---- Creating User Profile Matrix ----
        user_profile_matrix = sparse.csr_matrix(user_features[
                                                    user_meta_data.personal_info +
                                                    user_meta_data.genres +
                                                    user_meta_data.languages
                                                    ].to_numpy())

        # ---- Storing the data ----
        self.external_user_ids = external_user_ids
        self.external_item_ids = external_item_ids
        self.user_id_dict = user_id_dict
        self.item_id_dict = item_id_dict
        self.user_id_dict_inverted = self._invert_dict(user_id_dict)
        self.item_id_dict_inverted = self._invert_dict(item_id_dict)
        self.interactions = interactions
        self.weights = weights
        self.item_feature_matrix = item_feature_matrix
        self.user_feature_matrix = user_feature_matrix
        self.item_profile_matrix = item_profile_matrix
        self.item_genre_lang_matrix = item_genre_lang_matrix
        self.user_profile_matrix = user_profile_matrix
        self.user_count = len(self.user_id_dict.keys())
        self.item_count = len(self.item_id_dict.keys())

    def _build_and_set_lightfm_based_model(self, verbose: bool = False) -> None:
        """
        Generates the matrix factorization based model and trains it. Links the fitted model to the instance.

        :param verbose: [TESTING] If True, progress messages are printed.
        :return: This function doesn't return anything.
        """
        # ---- Reading Initialization Params ----
        no_components = self.no_components
        loss_function = self.loss_function
        epochs = self.epochs
        n_jobs = self.n_jobs_mf
        interactions = self.interactions
        use_weights = self.use_weights
        use_item_feature_matrix = self.use_item_feature_matrix
        use_user_feature_matrix = self.use_user_feature_matrix
        weights = self.weights if use_weights else None
        item_feature_matrix = self.item_feature_matrix if use_item_feature_matrix else None
        user_feature_matrix = self.user_feature_matrix if use_user_feature_matrix else None

        # ---- Creating The Model ----
        model = LightFM(
            no_components=no_components,
            loss=loss_function
        )

        # ---- Training and Storing the Model ----
        self.mf_model = model.fit(
            interactions=interactions,
            user_features=user_feature_matrix,
            item_features=item_feature_matrix,
            sample_weight=weights,
            epochs=epochs,
            num_threads=n_jobs,
            verbose=verbose
        )

    def _build_and_set_nn_user_feature_model(self):
        """
        Uses the unprocessed user profile data to create a NearestNeighbors estimator based on user profiles. Sets the
        trained model to the attribute 'nn_user_feature_model'.

        :return: Doesn't return anything.
        """
        nn_est = self._get_nearest_neighbor_estimator(
            self.user_profile_matrix,
            metric=self.nn_distance_metric,
            n_jobs=self.n_jobs_nn
        )
        self.nn_user_feature_model = nn_est

    def _build_and_set_nn_item_feature_model(self):
        """
        Uses the unprocessed game profile data to create a NearestNeighbors estimator based on game profiles. Sets the
        trained model to the attribute 'nn_game_feature_model'.

        :return: Doesn't return anything.
        """
        nn_est = self._get_nearest_neighbor_estimator(
            self.item_profile_matrix,
            metric=self.nn_distance_metric,
            n_jobs=self.n_jobs_nn
        )
        self.nn_game_feature_model = nn_est

    def _build_and_set_nn_item_genre_lang_model(self):
        """
        Uses the unprocessed game genres and languages data to create a NearestNeighbors estimator based on game
        profiles. Sets the trained model to the attribute 'nn_game_genre_lang_model'.

        :return: Doesn't return anything.
        """
        nn_est = self._get_nearest_neighbor_estimator(
            self.item_genre_lang_matrix,
            metric=self.nn_distance_metric,
            n_jobs=self.n_jobs_nn
        )
        self.nn_game_genre_lang_model = nn_est

    def _build_nn_item_feature_model(self, item_feature_matrix) -> NearestNeighbors:
        """
        Given a matrix of the format [Games, Features], this function creates a NearestNeighbors estimator for that
        feature matrix, and returns the trained estimator.

        :param item_feature_matrix: The matrix of item features which is to be used to train the estimator. Each row
            must have the profile vector of 1 game. Each column denotes one dimension (feature) of the vector.
        :return: The trained NearestNeighbors estimator.
        """
        nn_est = self._get_nearest_neighbor_estimator(
            item_feature_matrix,
            metric=self.nn_distance_metric,
            n_jobs=self.n_jobs_nn
        )
        return nn_est

    @staticmethod
    def _get_profiles_from_db(collection, id_col_name: str, cols, query_id: int = None, search_options=None):
        """
        Given an id, this function retrieves the profile of the user/item. It keeps those columns that are
        provided in the 'cols' parameter. It can narrow the search on the basis of 'search_options' parameter. If no
        search options are provided, none are used. If no id is provided, i.e., 'None' is given, search_options are
        used for searching. If neither of them is provided, empty list is returned.

        **IMPORTANT**: In case Id is provided, it must exist in the database.

        **IMPORTANT**: This function **converts integer based columns to float**, if even one of the columns specified in 'cols' is float.

        :param query_id: The id to search for.
        :param collection: The collection to perform the search in.
        :param id_col_name: The name of the column used as id.
        :param search_options: The options to refine search. This must be a valid MongoDB query.
        :param cols: The columns to keep. These must be valid columns. If invalid, behaviour is undefined.
        :return: A list of profiles in the order in which the corresponding ids were given.
        """
        if (query_id is None) and not search_options:
            return []
        elif (type(query_id) == int) and not search_options:
            query = {id_col_name: query_id}
        elif not (type(query_id) == int) and search_options:
            query = search_options
        else:
            query = {
                '$and': [
                    {id_col_name: query_id},
                    search_options
                ]
            }
        lst = []
        for i in collection.find(query):
            lst.append(i)
        if len(lst) == 0:
            return []
        df = pd.DataFrame(lst)
        df = df[cols]
        return df.to_numpy().tolist()

    def _get_games_owned_by_user(self, uid) -> list:
        """
        Returns the set of games owned by a user.

        :param uid: The id of the user.
        :return: A list of games that the user owns.
        """
        return [
            game['game_id'] for game in self.userGameInteractions.find(
                {
                    'uid': uid,
                    'owned': 1
                }
            )
        ]

    # ---- Private Recommender Methods ----
    def _get_user_item_mf_based_recs(self, user_id, threshold: float, k: int) -> list:
        """
        Produces game recommendations for a user based on the LightFM (Matrix Factorization) model. The user must exist
        in the model's data beforehand.

        :param user_id: The system based user id of the user.
        :param threshold: A rating value. All games whose calculated score is above it are assumed to be owned by the
            user.
        :param k: The number of un - owned gamed to be recommended to the user.
        :return: A  list of the 'k' games recommended to the user, that the user doesn't own.
        """
        model = self.mf_model
        interactions = self.interactions
        n_jobs = self.n_jobs_mf
        user_dict = self.user_id_dict_inverted
        item_dict = self.item_id_dict

        num_users, num_items = interactions.shape

        # Get the internal id corresponding to the current user
        internal_user_id = int(user_dict[user_id])

        # Get the predicted score for this user, for each game (internal game id's go from 0 to num_items - 1)
        game_ids_for_prediction = np.arange(num_items)
        scores = pd.Series(
            model.predict(
                internal_user_id,
                game_ids_for_prediction,
                num_threads=n_jobs
            ),
            index=game_ids_for_prediction
        )

        # TODO: Get this list from the database.
        # Get a list of games the user already owns (or has used), sorted so that the most recommended game comes first
        owned_games = [(i, scores.loc[i]) for i, v in enumerate(interactions.tocsr()[internal_user_id].toarray()[0]) if
                       v >= threshold]
        owned_games.sort(key=lambda tup: tup[1], reverse=True)
        owned_games = [i[0] for i in owned_games]

        # Sort the predictions in decreasing order of their score
        scores = list(pd.Series(scores.sort_values(ascending=False).index))

        # Removing all games already owned by the user
        scores = [x for x in scores if x not in owned_games]

        # Convert internal item ids to system based ids
        owned_games = list(pd.Series(owned_games).map(lambda x: item_dict[x]))
        scores = list(pd.Series(scores).map(lambda x: item_dict[x]))

        return scores[:k]

    def _get_user_item_nn_based_recs(self, uid: int, k: int) -> list:
        """
        Inputs a user id, and finds 'k' or less related games for that user based on the NearestNeighbors model. The
        user must exist in the database, but need not exist in the model.

        :param uid: The user id.
        :param k: The maximum number of recommendations to give.
        :return: A list containing system based item ids of the recommended games. The most recommended game comes
            first.
        """
        profile = self._get_profiles_from_db(
            query_id=uid,
            id_col_name=user_meta_data.identifiers[0],
            collection=self.allUserData,
            cols=user_meta_data.genres + user_meta_data.languages
        )[0]
        recs = self._get_k_neighbors(
            points=[profile],
            points_id_dict=self.item_id_dict,
            estimator=self.nn_game_genre_lang_model,
            k=k
        )[0]
        return recs

    def _get_user_user_nn_based_recs(self, uid: int, k: int) -> list:
        """
        Inputs a user id, and finds 'k' or less related users to that user based on the NearestNeighbors model. The user
        must exist in the database, but need not exist in the model.

        :param uid: The user id.
        :param k: The maximum number of recommendations to give.
        :return: A list containing system based item ids of the recommended users. The most recommended user comes
            first.
        """
        profile = self._get_profiles_from_db(
            query_id=uid,
            id_col_name=user_meta_data.identifiers[0],
            collection=self.allUserData,
            cols=user_meta_data.personal_info + user_meta_data.genres + user_meta_data.languages
        )[0]
        recs = self._get_k_neighbors(
            points=[profile],
            points_id_dict=self.user_id_dict,
            estimator=self.nn_user_feature_model,
            k=k,
            omit_first=True
        )[0]
        return recs

    def _get_item_item_nn_based_recs(self, game_id: int, k: int) -> list:
        """
        Inputs a game id, and finds 'k' or less related games to that game based on the NearestNeighbors model. The game
        must exist in the database, but need not exist in the model.

        :param game_id: The game id.
        :param k: The maximum number of recommendations to give.
        :return: A list containing system based item ids of the similar games. The most similar game comes
            first.
        """
        profile = self._get_profiles_from_db(
            query_id=game_id,
            id_col_name=game_meta_data.identifiers[0],
            collection=self.gameFeatures,
            cols=game_meta_data.game_specific_info + game_meta_data.genres + game_meta_data.languages
        )[0]
        recs = self._get_k_neighbors(
            points=[profile],
            points_id_dict=self.item_id_dict,
            estimator=self.nn_game_feature_model,
            k=k,
            omit_first=True
        )[0]
        return recs

    def _get_user_item_genre_nn_based_recs(self, uid: int, genres: list, merge_by_and: bool, k: int) -> list:
        """
        Inputs a user id, a set of genres, and a parameter 'merge_by_and'. Then, amongst all the games having those
        genres (all or at least one, depending on the value of 'merge_by_and'), finds the 'k' most relevant games for
        the user based on the NearestNeighbors model. The user must exist in the database, but need not exist in the
        model.

        :param uid: The user id.
        :param genres: The list of genres.
        :param merge_by_and: If true, games containing all the genres will be considered, else, games containing at
            least one genre will be considered.
        :param k: The maximum number of recommendations to give.
        :return: A list containing system based item ids of the recommended games. The most recommended game comes
            first.
        """
        user_profile = self._get_profiles_from_db(
            query_id=uid,
            id_col_name=user_meta_data.identifiers[0],
            collection=self.allUserData,
            cols=user_meta_data.genres + user_meta_data.languages
        )
        user_profile = user_profile[0]
        game_profiles = self._get_profiles_from_db(
                query_id=None,
                id_col_name=game_meta_data.identifiers[0],
                collection=self.gameFeatures,
                search_options=self._get_mongodb_query_from_genres(
                    genres=genres,
                    merge_by_and=merge_by_and
                ),
                cols=game_meta_data.identifiers + game_meta_data.genres + game_meta_data.languages
            )
        if len(game_profiles) == 0:
            return []
        games = pd.DataFrame(
            game_profiles,
            columns=game_meta_data.identifiers + game_meta_data.genres + game_meta_data.languages
        )
        # If 'k' exceeds the number of available games, all available games will be recommended. This is different from
        # the behaviour in other 3 cases. In other cases, k is set to the self.def_count value. Here, as such a request
        # will likely be done to show search results to a user, we provide all results found. (In the other cases,
        # recommendations are likely used to show results in boxes or sections of the website. Hence, there,
        # instead of all results, only the first self.def_count amount of results are returned in case k is large.)
        if k > games.shape[0]:
            k = games.shape[0]
        game_ids = games[game_meta_data.identifiers]
        game_features = games[game_meta_data.genres + game_meta_data.languages]
        estimator = self._get_nearest_neighbor_estimator(
            game_features.to_numpy().tolist(),
            metric=self.nn_distance_metric,
            n_jobs=self.n_jobs_nn
        )
        recs = self._get_k_neighbors(
            points=[user_profile],
            points_id_dict=dict(self._convert_id_list_to_dict(
                [x[0] for x in game_ids.to_numpy().tolist()]
            )),
            estimator=estimator,
            k=k
        )[0]
        # Reinterpreting ids as ints (_get_profiles_from_db function converts them to float).
        recs = [int(i) for i in recs]
        return recs
