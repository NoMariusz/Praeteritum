// Object.freeze make obj work like enum
export const MATCH_CONNECTION_STATUSES = Object.freeze({
    connecting: 0,
    connected: 1,
    canNotConnect: 2,
});
export const PLAYER_INFO_POSITIONS = Object.freeze({
    top: 0,
    bottom: 1,
});

export const MATCH_BOARD_SIZE = "70vh";

export const CARD_MARGIN_X = 0.003;

// list storing lists with cards types name and fullname
export const CARD_TYPES = [['S', 'Spearman'], ['I', 'Infantryman'], ['C', 'Cavalryman'], ['M', 'Missleman']]
