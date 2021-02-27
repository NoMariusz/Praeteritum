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

// unit and cards related

export const CARD_IMAGES_PATH = "/static/images/cards_images/";
// list storing lists with cards types name and fullname
export const CARD_TYPES = [
    ["S", "Spearman"],
    ["I", "Infantryman"],
    ["C", "Cavalryman"],
    ["M", "Missleman"],
];

// selecting elements in game

export const SELECTED_ELEMENT_TEMPLATE = { type: -1, id: -1 };
export const SELECTABLE_ELEMENTS = Object.freeze({
    card: 0,
    unit: 1,
});
export const HIGHLIGHT_COLOR = "warning.main"
