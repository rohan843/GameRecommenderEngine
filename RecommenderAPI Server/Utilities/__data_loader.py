# import ast
# from pymongo import MongoClient
# import pandas as pd

# client = MongoClient('mongodb://localhost:27017/')
# db = client.GameData
# userGamesData = db.userGamesData
# gamesData = db.gamesData

# with open('../OldDatasets/users_items.json') as UserDataFile:
#     UserData = UserDataFile.readlines()

# # Placing the data in a mongoDB database
# for i in range(len(UserData)):
#     post1 = ast.literal_eval(UserData[i])
#     userGamesData.insert_one(post1)

# IMPORTANT
# Use the below format to load the dataframe
# df1 = pd.DataFrame(list(userGamesData.find()))

# with open('../OldDatasets/steam_games.json') as GameDataFile:
#     GameData = GameDataFile.readlines()

# # Placing the data in a mongoDB database
# for i in range(len(GameData)):
#     post = ast.literal_eval(GameData[i])
#     gamesData.insert_one(post)

# IMPORTANT
# Use the below format to load the dataframe
# df2 = pd.DataFrame(list(gamesData.find()))
