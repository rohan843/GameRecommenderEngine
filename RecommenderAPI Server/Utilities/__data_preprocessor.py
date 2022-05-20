# import pandas as pd
# import numpy as np
# import ast
# from pymongo import MongoClient
# import warnings
#
# Ignore Warnings
# warnings.filterwarnings('ignore')
#
# client = MongoClient('mongodb://localhost:27017/')
# db = client.GameData
# userGamesData = db.userGamesData
# gamesData = db.gamesData

# # df = pd.DataFrame(list(gamesData.find()))
# # df.to_csv('games_data.csv')
#
# df = pd.DataFrame(list(userGamesData.find()))
#
# # GamesPerUser = df[['user_id', 'items_count']]
# # GamesPerUser.to_csv('games_per_user.csv')
#
# df['item_id'] = df['items'].apply(lambda x: [item['item_id'] for item in x])
# df['uid'] = np.arange(len(df))
#
# df = df[['uid', 'item_id']]
#
# # Too Slow
# # dfNew = pd.DataFrame(columns=['uid', 'item_id'])
# # for i, row in df.iterrows():
# #     for item_id in row['item_id']:
# #         dfNew.loc[len(df.index)] = [row['uid'], item_id]
#
# # To explode rows quickly
# df = df.explode('item_id')
#
# df['owned'] = np.ones(len(df), dtype=int)
#
# df['item_id'] = df['item_id'].astype(int)
# df = df.rename(columns={'item_id': 'id'})

# df = pd.read_csv('tmp.csv')
# gamesDf = pd.DataFrame(list(gamesData.find()))
# gamesDf = gamesDf.dropna(subset=['id'])
# gamesDf['id'] = gamesDf['id'].astype(dtype=int)
#
# allDataDf = pd.merge(df, gamesDf, on='id')
# allDataDf = allDataDf.dropna(subset='title')
# allDataDf.to_csv('all_named_data.csv')
# recData = allDataDf[['id', 'uid', 'owned']]
# recData.to_csv('rec_data.csv')
# print(recData)
