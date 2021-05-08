'use strict';

// selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0'); // NOTE add '#' when select by ID instead of class
const score1El = document.getElementById('score--1'); // NOTE another way to select by ID, faster than querySelector
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

// NOTE declare global variable
let scores, currentScore, activePlayer, playing;

// helper:
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};

// helper:
const switchPlayer = function () {
  // reset current score of activePlayer
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  // switch to next player
  activePlayer = activePlayer === 0 ? 1 : 0;
  // reset current score
  currentScore = 0;
  // reverse the background color of both players
  player0El.classList.toggle('player--active'); // NOTE toggle() add class if the element does not contain the class, and remove it otherwise
  player1El.classList.toggle('player--active');
};

// starting conditions
init();

// rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1. generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2. display dice
    diceEl.src = `dice-${dice}.png`; // NOTE
    diceEl.classList.remove('hidden');

    // 3. check for rolled 1: if true, switch to next player; if false, add number to current score
    if (dice !== 1) {
      // add dice to the current score
      currentScore += dice;
      document.getElementById(
        `current--${activePlayer}` // NOTE dynamically select element using ID
      ).textContent = currentScore;
    } else {
      switchPlayer();
    }
  }
});

// holding score functionality
btnHold.addEventListener('click', function () {
  if (playing) {
    // 1. add current score to active player's score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    // 2. check if player's score is >= 100
    if (scores[activePlayer] >= 20) {
      // finish the game
      playing = false;
      diceEl.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`) // NOTE DO NOT forget add dot '.' when dealing with class
        .classList.add('player--winner');
      player0El.classList.remove('player--active');
    } else {
      // switch to next player
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', init);
