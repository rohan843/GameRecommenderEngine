from pymongo import MongoClient
from colorama import Fore, Style


class GenreList:
    def __init__(self):
        self.client = MongoClient('mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/')
        self.sysDB = self.client.sysDB
        self.genres_collection = self.sysDB.genres

        self._log('Loading Genres...')

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
