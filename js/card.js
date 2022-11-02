export default class Card extends EventTarget {

    static get suits() { return { CLUBS: 'clubs', DIAMONDS: 'diamonds', HEARTS: 'hearts', SPADES: 'spades' } };
    static get ranks() { return { ACE: 'ace', TWO: 'two', THREE: 'three', FOUR: 'four', FIVE: 'five', SIX: 'six', SEVEN: 'seven', EIGHT: 'eight', NINE: 'nine', TEN: 'ten', JACK: 'jack', QUEEN: 'queen', KING: 'king' } };

    #suit;
    #rank;
    #isRevealed;
    #element;

    get suit() { return this.#suit; }
    get rank() { return this.#rank; }
    get isRevealed() { return this.#isRevealed; }
    get element() { return this.#element; }
    get color() { return this.#suit === Card.suits.CLUBS || this.#suit === Card.suits.SPADES ? 'black' : 'red'; }
    get value() { return Object.values(Card.ranks).indexOf(this.#rank) + 1; }

    constructor(suit, rank, isRevealed = false) {
        super();
        this.#suit = suit;
        this.#rank = rank;
        this.#isRevealed = isRevealed;
        this.#element = document.createElement('div');

        this.#element.classList.add('card');

        if (isRevealed) this.reveal();
        else this.hide();
}

    static fromElement(element) {
        let suit = Object.values(Card.suits).find(suit => element.classList.contains(suit));
        let rank = Object.values(Card.ranks).find(rank => element.classList.contains(rank));
        let isRevealed = element.classList.contains('isRevealed');

        if (suit && rank) return new Card(suit, rank, isRevealed);
        else throw new Error('Invalid card element');
    }

    static isValidSuit(suit) {
        return Object.values(Card.suits).includes(suit);
    }

    reveal() {
        this.#isRevealed = true;
        this.#element.classList.add(this.#suit);
        this.#element.classList.add(this.#rank);
    }

    hide() {
        this.#isRevealed = false;
        this.#element.classList.remove(this.#suit);
        this.#element.classList.remove(this.#rank);
    }
}