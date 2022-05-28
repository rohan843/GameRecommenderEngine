from pymongo import MongoClient
from colorama import Fore, Style
from constants import *


class GenreList:
    def __init__(self):
        self.client = MongoClient(DB_CLUSTER_URL)
        self.sysDB = self.client.sysDB
        self.genres_collection = self.sysDB.genres

        self._log('Loading Genres...')
        self.raw_genre_data = [x for x in self.genres_collection.find()]
        if len(self.raw_genre_data) != 1:
            self._log('Bad data in sysDB -> genres', lvl=3)
        self.genre_dict = self._get_genre_dict(self.raw_genre_data[0])
        self._log('Genres Loaded')

        self._log('Genre List Initialized')

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
            print(f"{Fore.RED}Validator: {msg}{Style.RESET_ALL}")
        elif lvl == 2:
            print(f"{Fore.YELLOW}Validator: {msg}{Style.RESET_ALL}")
        else:
            print(f"GenreList: {msg}")

    @staticmethod
    def _get_genre_dict(raw_data: dict):
        """
        Creates a dictionary of genres of the form {genre id -> genre}.
        """
        genres = raw_data.keys()
        genre_dict = {}
        for i in genres:
            if i != '_id':
                genre_dict[raw_data[i]] = i
        return genre_dict

    def genre_from_id(self, genre_id: int):
        """
        Inputs a genre id and returns the corresponding genre. Returns '' if given id is invalid.
        """
        if genre_id in self.genre_dict.keys():
            return self.genre_dict[genre_id]
        else:
            return ''

    def genre_list_from_id_string(self, id_string: str):
        """
        Converts a comma separated string of genre ids to corresponding genres' list. E.g., '1,2,3' -> ['Strategy', 'RPG', 'Photo Editing']
        """
        id_list = id_string.strip().split(',')
        id_list = [int(i) for i in id_list]
        genre_list = []
        for i in id_list:
            if self.genre_from_id(i):
                genre_list.append(self.genre_from_id(i))
        return genre_list
