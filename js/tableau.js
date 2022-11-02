import Card from "./card.js";
import Deck from "./deck.js";

export default class Tableau extends Deck {

    get isFullyRevealed() { return this.size === 0 || this.cards.every(card => card.isRevealed) };

    constructor(cards = []) {
        super();
        
        cards = cards instanceof Card ? [cards] : cards;
        cards.forEach(card => this.add(card));


        this.element.addEventListener('click', event => {
            if (this.size > 0 && event.target === this.topCard.element) this.revealTopCard();
        });

        this.element.addEventListener('mousedown', () => {
            let card = this.cards.find(card => card.element === event.target);
            let index = this.indexOf(card);
            if (card.isRevealed && index !== -1 && this.isValidSequence(index)) {
                this.dispatchEvent(new CustomEvent('cardpickup', { detail: { index: this.indexOf(card), tableau: this } }));
            }
        });
    }

    add(cards) {
        super.add(cards);

        if (cards instanceof Card) cards = [cards];

        cards.forEach(card => this.element.appendChild(card.element));
    }

    split(index) {
        return new Tableau(this.draw(this.size - index));
    }

    isValidSequence(startIndex) {
        let cards = this.cards.slice(startIndex);
        if (cards.length < 2) return true;

        for (let i = 0; i < cards.length - 1; i++) {
            if (!cards[i].isRevealed || !cards[i + 1].isRevealed) return false;
            if (cards[i].value !== cards[i + 1].value + 1) return false;
            if (cards[i].color === cards[i + 1].color) return false;
        }

        return true;
    }

    isValidMove(card) {
        if (Array.isArray(card)) card = card[0];

        if (this.size === 0) return card.value === 13;
        else if (!this.topCard.isRevealed) return false;
        else return card.value === this.topCard.value - 1 && card.color !== this.topCard.color;
    }
}

