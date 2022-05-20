class ValidationError(Exception):
    """
    Thrown when some validation fails.
    """

    def __init__(self, message):
        # Call the base class constructor with the parameters it needs
        super().__init__(message)
