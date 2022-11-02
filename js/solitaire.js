import Card from "./card.js";
import Deck from "./deck.js";
import Foundation from "./foundation.js";
import Tableau from "./tableau.js";

let deckContainer = document.querySelector('.stock');
let discardContainer = document.querySelector('.waste');

let spadesContainer =   document.querySelector('.foundation.spades');
let heartsContainer =   document.querySelector('.foundation.hearts');
let diamondsContainer = document.querySelector('.foundation.diamonds');
let clubsContainer =    document.querySelector('.foundation.clubs');

let tableauContainers = document.querySelectorAll('.tableau');

let stock = Deck.createDeck();
let waste = new Deck();

let spadesFoundation = new Foundation(Card.suits.SPADES);
let heartsFoundation = new Foundation(Card.suits.HEARTS);
let diamondsFoundation = new Foundation(Card.suits.DIAMONDS);
let clubsFoundation = new Foundation(Card.suits.CLUBS);

let foundations = [spadesFoundation, heartsFoundation, diamondsFoundation, clubsFoundation];

let tableaus = [];

let draggedCards = [];
let draggingContainer = document.createElement('div');
draggingContainer.classList.add('dragging');

let dropSource = null;

document.body.appendChild(draggingContainer);

deckContainer.appendChild(stock.element);
discardContainer.appendChild(waste.element);
spadesContainer.appendChild(spadesFoundation.element);
heartsContainer.appendChild(heartsFoundation.element);
diamondsContainer.appendChild(diamondsFoundation.element);
clubsContainer.appendChild(clubsFoundation.element);

for (let tableauContainer of tableauContainers) {
    let tableau = new Tableau();
    tableaus.push(tableau);
    tableauContainer.appendChild(tableaus[tableaus.length - 1].element);

    tableau.addEventListener('cardpickup', event => {
        let tableau = event.detail.tableau;
        let index = event.detail.index ?? 0;

        dropSource = tableau;
        draggingContainer.style.top = tableau.cards[index].element.offsetTop + 'px';
        draggingContainer.style.left = tableau.cards[index].element.offsetLeft + 'px';

        draggedCards = tableau.split(index).cards;
        draggedCards.forEach(card => draggingContainer.appendChild(card.element));

    });
}

for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
        let card = stock.draw()[0];
        if (j === i) card.reveal();
        tableaus[i].add(card);
    }
}

stock.element.addEventListener('click', () => {
    if (stock.size === 0) {
        stock.add(waste.drawAll().reverse());
        stock.hideAll();
    } else {
        waste.add(stock.draw(1, true));
    }
});

waste.element.addEventListener('mousedown', () => {
    if (waste.size > 0) {
        draggingContainer.style.top = waste.element.offsetTop + 'px';
        draggingContainer.style.left = waste.element.offsetLeft + 'px';

        console.log(draggingContainer.style.top, draggingContainer.style.left);

        dropSource = waste;

        draggedCards = new Tableau(waste.draw()).cards;
        draggingContainer.appendChild(draggedCards[0].element)
    }
});

draggingContainer.addEventListener('mousemove', event => {
    draggingContainer.style.top = draggingContainer.offsetTop + event.movementY + 'px';
    draggingContainer.style.left = draggingContainer.offsetLeft + event.movementX + 'px';
});

draggingContainer.addEventListener('mouseup', event => {
    draggingContainer.style.top = - draggingContainer.offsetHeight + 'px';
    draggingContainer.style.left = - draggingContainer.offsetWidth + 'px';
});

draggingContainer.addEventListener('mouseleave', event => {
    if (event.relatedTarget === null || !event.relatedTarget.classList.contains('card')) {
        dropSource.add(draggedCards);
        draggedCards = [];
    } else {
        [...foundations, ...tableaus].forEach(container => {
            if (container.element === event.relatedTarget || container.element.contains(event.relatedTarget)) {
                if (container.isValidMove(draggedCards)) {
                    container.add(draggedCards);
                    draggedCards = [];
                    checkForWin();
                    return;
                }
            }
        });

        dropSource.add(draggedCards);
        draggedCards = [];
    }
});

function checkForWin() {
    if (stock.size === 0 && waste.size === 0) {
        for (let tableau of tableaus) {
            if (!tableau.isFullyRevealed) return;
        }

        let interval = setInterval(() => { 
            if (!autoCompleteRandomCard()) {
                clearInterval(interval);
                alert('You win!');
            }
        }, 50);
    }
}

function autoCompleteRandomCard() {
    for (let tableau of tableaus) {
        if (tableau.size === 0) continue;

        let card = tableau.topCard;

        if (card.isRevealed) {
            for (let foundation of foundations) {
                if (foundation.isValidMove(card)) {
                    foundation.add(tableau.draw());
                    return true;
                }
            }
        }
    }

    return false;
}