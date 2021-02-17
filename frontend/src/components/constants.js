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
// list storing rarity colors in order as in choice in model
export const CARD_RARITIES_COLORS = ['#7E88C1', '#36B552', '#B5B036', '#B5515D', '#B5952D']
export const CARD_IMAGES_PATH = '/static/images/cards_images/'
