const images = [
    '../Imagenes/carta1.png',
    '../Imagenes/carta2.jpeg',
    '../Imagenes/carta3.png',
    '../Imagenes/carta4.jfif',
    '../Imagenes/carta5.png',
    '../Imagenes/carta6.png',
    '../Imagenes/carta7.jfif',
    '../Imagenes/carta8.png',
    '../Imagenes/carta9.png',
    '../Imagenes/carta10.png'
];

let cards = [...images, ...images];
cards.sort(() => 0.5 - Math.random());

const gameBoard = document.getElementById('gameBoard');
const player1ScoreElem = document.getElementById('player1Score');
const player2ScoreElem = document.getElementById('player2Score');
const currentPlayerElem = document.getElementById('currentPlayer');
const resetButton = document.getElementById('resetButton');
const otherPageButton = document.getElementById('otherPageButton');

let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let revealedCards = [];
let revealedCardElements = [];
let revealedCount = 0;
let matchedPairs = 0;

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="${image}" alt="card image">`;
    card.addEventListener('click', () => revealCard(card, image));
    return card;
}

function revealCard(card, image) {
    if (revealedCount >= 2 || card.classList.contains('revealed')) return;

    card.classList.add('revealed');
    revealedCards.push(image);
    revealedCardElements.push(card);
    revealedCount++;

    if (revealedCount === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    if (revealedCards[0] === revealedCards[1]) {
        if (currentPlayer === 1) {
            player1Score++;
            player1ScoreElem.textContent = player1Score;
        } else {
            player2Score++;
            player2ScoreElem.textContent = player2Score;
        }
        matchedPairs++;
        if (matchedPairs === images.length) {
            endGame();
        } else {
            resetTurn(true);
        }
    } else {
        resetTurn(false);
        switchPlayer();
    }
}

function resetTurn(matched) {
    revealedCards = [];
    if (!matched) {
        revealedCardElements.forEach(card => card.classList.remove('revealed'));
    }
    revealedCardElements = [];
    revealedCount = 0;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    currentPlayerElem.textContent = `Jugador ${currentPlayer}`;
}

function endGame() {
    let message;
    if (player1Score > player2Score) {
        message = 'Jugador 1, ganaste!';
    } else if (player2Score > player1Score) {
        message = 'Jugador 2, ganaste!';
    } else {
        message = 'Jugadores 1 y 2, empataron!';
    }
    alert(message);
}

function resetGame() {
    cards = [...images, ...images];
    cards.sort(() => 0.5 - Math.random());
    gameBoard.innerHTML = '';
    cards.forEach(image => gameBoard.appendChild(createCard(image)));
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    revealedCards = [];
    revealedCardElements = [];
    revealedCount = 0;
    matchedPairs = 0;
    player1ScoreElem.textContent = player1Score;
    player2ScoreElem.textContent = player2Score;
    currentPlayerElem.textContent = `Jugador ${currentPlayer}`;
}

cards.forEach(image => {
    gameBoard.appendChild(createCard(image));
});

resetButton.addEventListener('click', resetGame);
otherPageButton.addEventListener('click', () => {
    window.location.href = 'Sorpresa.html'; // Cambia este enlace a la URL deseada
});
