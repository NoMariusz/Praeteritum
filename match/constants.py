# overall Match stuff
DEFAULT_BASE_POINTS = 15
MATCH_DELETE_TIMEOUT = 180

MATCH_FINDING_TIME_LIMIT = 25

# cards stuff

CARDS_DRAWED_AT_START_COUNT = 3
CARDS_DRAWED_AT_TURN_COUNT = 1

# turns stuff

TURN_TIME = 100  # time in seconds
TURN_STATUS_REFRESH_TIME = 5

# board stuff

BOARD_ROWS = 8
BOARD_COLUMNS = 8
# id of fields whose should be matked as base fields
BASE_FIELDS_IDS = [
    1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 49, 50, 51, 52, 53, 54, 57, 58,
    59, 60, 61, 62]

# units stuff
DEFAULT_ENERGY = 2
ATACK_RANGE_FOR_TYPES = [1, 1, 1, 3]
# list ordered that at index x is Unit of type y such as Unit type x is strong
# against Unit type y cat = category
STRONG_AGAINST_CAT_TO_CAT = [2, 0, 1, -1]
# list ordered that at index x is Unit of type y such as Unit type x is weak
# against Unit type y cat = category
WEAK_AGAINST_CAT_TO_CAT = [1, 2, 0, -1]
# category that only can attack, not defend when is attacking
ONLY_ATTACKER_CAT = 3
