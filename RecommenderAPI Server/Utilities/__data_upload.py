# import pandas as pd
# from pymongo import MongoClient
#
# client = MongoClient('mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/')
# db = client.recommenderDB
# gameFeaturesCollection = db.gameFeatures
# allGameDataCollection = db.allGameData
# allUserDataCollection = db.allUserData
# userGameInteractionCollection = db.userGameInteractions

# Uploading user data
# userData = pd.read_csv('../Datasets/userDataWithGenres.csv').drop('Unnamed: 0', 1).drop('_id', 1)
# lst = []
#
#
# def store_all_user_data_to_db(x):
#     post = dict(
#         [
#             (col, x[col]) for col in x.index
#         ]
#     )
#     post['uid'] = int(post['uid'])
#     post['age'] = int(post['age'])
#     lst.append(post)
#
#
# userData.apply(store_all_user_data_to_db, axis=1)
# allUserDataCollection.insert_many(lst)

# Uploading data for game features
# gameFeatures = pd.read_csv('../Datasets/gameFeatures.csv').drop('Unnamed: 0', 1)
# gameData = pd.read_csv('../Datasets/gameData.csv').drop('Unnamed: 0', 1)
# gameData = gameData[
#     ['id', 'url', 'types', 'name', 'desc_snippet', 'all_reviews', 'developer', 'publisher',
#      'popular_tags', 'game_details', 'languages', 'achievements', 'genre',
#      'game_description', 'mature_content', 'minimum_requirements',
#      'recommended_requirements', 'original_price', 'discount_price', 'release_date_y']
# ]
# print(gameData)


# lst = []


# def store_game_features_to_db(x):
#     post = dict(
#         [(col, x[col]) for col in x.index]
#     )
#     post['id'] = int(post['id'])
#     lst.append(post)
#     print(post['id'])


# lst = []


# def store_game_data_to_db(x):
#     post = dict(
#         [(col, x[col]) for col in x.index]
#     )
#     post['id'] = int(post['id'])
#     lst.append(post)
#     print(post['id'])


# gameFeatures.apply(store_game_features_to_db, axis=1)
# gameData.apply(store_game_data_to_db, axis=1)
# allGameDataCollection.insert_many(lst)

# user_game_interactions = pd.read_csv('../Datasets/userGameInteractions.csv').drop('Unnamed: 0', 1)
#
# lst = []
#
#
# def store_user_game_interactions_to_db(x):
#     post = dict(
#         [(col, x[col]) for col in x.index]
#     )
#     post['uid'] = int(post['uid'])
#     post['game_id'] = int(post['game_id'])
#     post['owned'] = int(post['owned'])
#     lst.append(post)
#     print(post['uid'], post['game_id'])
#
#
# user_game_interactions.apply(store_user_game_interactions_to_db, axis=1)
# userGameInteractionCollection.insert_many(lst)
# gameFeaturesCollection.insert_many(lst)
# print(len(lst))
# print(lst)


# lst = []
#
#
# def store_all_user_data_to_db(x):
#     post = dict(
#         [
#             (col, x[col]) for col in x.index
#         ]
#     )
#     post['uid'] = int(post['uid'])
#     post['age'] = int(post['age'])
#     lst.append(post)
#
#
# userData = pd.read_csv('../Datasets/allUserData.csv')
# userData.apply(store_all_user_data_to_db, axis=1)
# allUserDataCollection.insert_many(lst)
