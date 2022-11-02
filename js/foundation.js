import Card from './card.js';
import Deck from './deck.js';

export default class Foundation extends Deck {

    #type;

    constructor(type) {
        super();

        if (!Card.isValidSuit(type)) throw new Error('Invalid type');
        this.#type = type;
    }

    isValidMove(card) {
        if (Array.isArray(card)) card = card[0];
        if (this.size === 0) return card.value === 1 && card.suit === this.#type;
        else return card.value === this.topCard.value + 1 && card.suit === this.#type;
    }
}