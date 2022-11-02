import Card from "./card.js";

export default class Deck extends EventTarget {
    #cards;
    #element;

    get element() { return this.#element }
    get size() { return this.#cards.length }
    get topCard() { return this.#cards[this.#cards.length - 1] }
    get bottomCard() { return this.#cards[0] }
    get cards() { return this.#cards.slice() }

    constructor(cards = []) {
        super();
        this.#cards = cards instanceof Card ? [cards] : cards;

        this.#element = document.createElement('div');

        this.#updateElement();
    }

    #updateElement() {
        this.#element.className = this.topCard?.element.className ?? 'card empty';
    }

    static createDeck(shuffled = true) {
        let deck = new Deck();

        for (let suit in Card.suits) {
            for (let rank in Card.ranks) {
                deck.#cards.push(new Card(Card.suits[suit], Card.ranks[rank]));
            }
        }

        if (shuffled) deck.shuffle();

        deck.#updateElement();

        return deck;
    }

    draw(amount = 1, reveal = false) {
        let cards = this.#cards.splice(this.#cards.length - amount, amount);

        if (reveal) cards.forEach(card => card.reveal());

        this.#updateElement();

        return cards;
    }

    drawAll(reveal = false) {
        return this.draw(this.#cards.length, reveal);
    }

    revealTopCard() {
        this.topCard?.reveal();
        this.#updateElement();
    }

    hideAll() {
        this.#cards.forEach(card => card.hide());
        this.#updateElement();
    }

    indexOf(card) {
        return this.#cards.indexOf(card);
    }

    add(cards) {
        cards = cards instanceof Card ? [cards] : cards;
        
        this.#cards.push(...cards);
        cards.forEach(card => card.element.parentNode?.removeChild(card.element));

        this.#updateElement();
    }
    
    shuffle() { this.#cards.sort(() => Math.random() - 0.5) }
}