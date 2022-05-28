"""
This module contains the main functionality of the recommender API. It provides the following endpoints:

- /user_game_rec : Get game recommendations for a user. The url parameters are:
    1. uid: REQUIRED Must be an integer user id of the user.
    2. k: OPTIONAL The maximum number of recommendations to provide.

- /user_user_rec : Get users similar to a given user. The url parameters are:
    1. uid: REQUIRED Must be an integer user id of the user.
    2. k: OPTIONAL The maximum number of recommendations to provide.

- /game_game_rec : Get games similar to a given game. The url parameters are:
    1. game_id: REQUIRED Must be an integer game id of the game.
    2. k: OPTIONAL The maximum number of recommendations to provide.

- /genre_game_rec : Get game recommendations for a user, with games of the specified genres. The url parameters are:
    1. uid: REQUIRED Must be an integer user id of the user.
    2. k: OPTIONAL The maximum number of recommendations to provide.
    3. genres: REQUIRED The comma - separated, list of genre ids for which the games are to be found.
    4. merge_by_and: REQUIRED If True, the games having all the specified genres are chosen. Else, games having at least
        one genre are chosen.

- /refresh_model_data : A POST request to this endpoint causes the recommender model data to be refreshed, i.e.,
    reloaded from the database. The request must contain a password in its header. If the password matches the one in
    the record (in database), only then model data is refreshed. The header must include:
        1. pw: REQUIRED A valid password to authorize the refreshing of model.

In all cases except game recommendations for users, the response is of the form of a JSON string, with the following
syntax:

{
    'message': The message in the response.
    'recommendations': A list of recommendations. The id of the most recommended user/item comes first.
}

In the case of game recommendations for users, the response is of the following form:
{
    'message': The message in the response.
    'recommendations': {
        'profile_based': list of game recommendations for the user on the basis of user profile
            (content - based recommendations). Most relevant games come first.,
        'similar_user_based': list of game recommendations for the user on the basis of choices of similar users
            (collaborative filtering based recommendations). Most relevant games come first.,
        'owned': list of games that the user owns.
    }
}
"""

from flask import Flask, jsonify, request
from recommender import Recommender
from validator import Validator
from readerwriterlock import rwlock
from genrelist import GenreList
from constants import *

app = Flask(__name__)

recommender = Recommender()
validator = Validator()
rw_lock = rwlock.RWLockWrite()
genre_list = GenreList()


def get_json_based_response(code: int, desc: str):
    """
    Returns a desired response with the required HTTP code and a description message. Can be used for error handling.

    :param code: The HTTP status code.
    :param desc: The response message.
    :return: A tuple of Response object with the supplied code and message as json, and the supplied code.
    """

    return jsonify({
        'message': desc,
        'recommendations': []
    }), code


# ---- API Endpoints Definition ----
@app.route('/user_game_rec', methods=['GET'])
def get_user_game_recs():
    # ---- Get User ID ----
    if 'uid' not in request.args:
        return get_json_based_response(400, desc='User id not provided.')
    try:
        uid = int(request.args.get('uid'))
    except ValueError:
        return get_json_based_response(400, desc='The provided user id is invalid.')
    if not validator.validate_user_id(uid):
        return get_json_based_response(400, desc='The provided user id doesn\'t exist.')

    # ---- Get k = the number of recommendations needed ----
    k = None
    if 'k' in request.args:
        try:
            k = int(request.args.get('k'))
        except ValueError:
            return get_json_based_response(400, desc='Invalid value for k, recommendation count, provided.')
    with rw_lock.gen_rlock():
        return jsonify(
            {
                'message': 'Successfully found game recommendations',
                'recommendations':
                    recommender.get_user_game_recs(uid, k)
            }
        )


@app.route('/user_user_rec', methods=['GET'])
def get_user_user_recs():
    # ---- Get User ID ----
    if 'uid' not in request.args:
        return get_json_based_response(400, desc='User id not provided.')
    try:
        uid = int(request.args.get('uid'))
    except ValueError:
        return get_json_based_response(400, desc='The provided user id is invalid.')
    if not validator.validate_user_id(uid):
        return get_json_based_response(400, desc='The provided user id doesn\'t exist.')

    # ---- Get k = the number of recommendations needed ----
    k = None
    if 'k' in request.args:
        try:
            k = int(request.args.get('k'))
        except ValueError:
            return get_json_based_response(400, desc='Invalid value for k, recommendation count, provided.')
    with rw_lock.gen_rlock():
        return jsonify(
            {
                'message': 'Successfully found similar users.',
                'recommendations': recommender.get_user_user_recs(uid, k)
            }
        )


@app.route('/game_game_rec', methods=['GET'])
def get_game_game_recs():
    # ---- Get Game ID ----
    if 'game_id' not in request.args:
        return get_json_based_response(400, desc='Game id not provided.')
    try:
        game_id = int(request.args.get('game_id'))
    except ValueError:
        return get_json_based_response(400, desc='The provided game id is invalid.')
    if not validator.validate_game_id(game_id):
        return get_json_based_response(400, desc='The provided game id doesn\'t exist.')

    # ---- Get k = the number of recommendations needed ----
    k = None
    if 'k' in request.args:
        try:
            k = int(request.args.get('k'))
        except ValueError:
            return get_json_based_response(400, desc='Invalid value for k, recommendation count, provided.')
    with rw_lock.gen_rlock():
        return jsonify(
            {
                'message': 'Successfully found similar games.',
                'recommendations': recommender.get_game_game_recs(game_id, k)
            }
        )


@app.route('/genre_game_rec', methods=['GET'])
def get_genre_based_recs():
    # ---- Get User ID ----
    if 'uid' not in request.args:
        return get_json_based_response(400, desc='User id not provided.')
    try:
        uid = int(request.args.get('uid'))
    except ValueError:
        return get_json_based_response(400, desc='The provided user id is invalid.')
    if not validator.validate_user_id(uid):
        return get_json_based_response(400, desc='The provided user id doesn\'t exist.')

    # ---- Get Genre ----
    if 'genres' not in request.args:
        return get_json_based_response(400, desc='Genres not provided.')
    genres = request.args.get('genres')
    if not genres:
        return get_json_based_response(200, desc='Genres list empty.')

    # ---- Get merge_by_and parameter ----
    if 'merge_by_and' not in request.args:
        return get_json_based_response(400, desc='merge_by_and parameter not provided.')
    merge_by_and = request.args.get('merge_by_and')
    if merge_by_and.lower() == 'true':
        merge_by_and = True
    elif merge_by_and.lower() == 'false':
        merge_by_and = False
    else:
        return get_json_based_response(400, desc='Invalid merge_by_and parameter provided.')

    # ---- Get k = the number of recommendations needed ----
    k = None
    if 'k' in request.args:
        try:
            k = int(request.args.get('k'))
        except ValueError:
            return get_json_based_response(400, desc='Invalid value for k, recommendation count, provided.')
    with rw_lock.gen_rlock():
        return jsonify(
            {
                'message': 'Successfully found similar games.',
                'recommendations': recommender.get_games_by_genre(
                        uid=uid,
                        genres=genre_list.genre_list_from_id_string(genres),
                        merge_by_and=merge_by_and,
                        k=k
                    )
            }
        )


@app.route('/refresh_model_data', methods=['POST'])
def refresh_model_data():
    if 'pw' not in request.headers:
        return get_json_based_response(401, 'Password not provided.')
    pw = request.headers.get('pw')
    if validator.validate_model_refresh_password(pw):
        r1 = Recommender()
        global recommender
        with rw_lock.gen_wlock():
            recommender = r1
        return get_json_based_response(200, 'Model successfully refreshed.')
    else:
        return get_json_based_response(401, 'Incorrect password provided.')


# ---- Error Handlers ----
@app.errorhandler(404)
def page_not_found(e):
    return get_json_based_response(404, 'This service endpoint doesn\'t exist. Maybe there was a typo in the url?')


@app.errorhandler(405)
def method_not_allowed(e):
    return get_json_based_response(405, 'The method is not allowed for the requested URL.')


if __name__ == '__main__':
    app.run(
        port=FLASK_PORT
    )
