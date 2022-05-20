from pymongo import MongoClient
from colorama import Fore, Style


class Validator:
    """
    Defines various methods to validate requests against data in the database.
    """

    def __init__(self):
        self.client = MongoClient('mongodb+srv://user1:PasswordMongoDB@cluster0.ilunp.mongodb.net/')
        self.sysDB = self.client.sysDB
        self.recommenderDB = self.client.recommenderDB
        self._log('Validator Initialized')

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
            print(f"Validator: {msg}")

    def validate_model_refresh_password(self, pw: str) -> bool:
        """
        Given a password, checks if that password can be used to refresh the model.

        :param pw: The password to search in the database.
        :return: True if the password is valid, else, False.
        """
        collection = self.sysDB.modelRefreshPasswords
        return collection.find_one({'pw': pw}) is not None

    def validate_user_id(self, uid: int) -> bool:
        """
        Given a user id, checks if that user exists in the system database.

        :param uid: The user id to search in the database.
        :return: True if user exists, else, False
        """
        collection = self.recommenderDB.allUserData
        return collection.find_one({'uid': uid}) is not None

    def validate_game_id(self, game_id: int) -> bool:
        """
        Given a game id, checks if that game exists in the system database.

        :param game_id: The game id to search in the database.
        :return: True if game exists, else, False
        """
        collection = self.recommenderDB.allGameData
        return collection.find_one({'id': game_id}) is not None
