'use strict';

/*
console.log(document.querySelector('.message').textContent); // 1. select element 2. select text in the element
document.querySelector('.message').textContent = 'Correct Number!'; // manipulate content
console.log(document.querySelector('.message').textContent);

document.querySelector('.number').textContent = 13;
document.querySelector('.score').textContent = 10;

console.log(document.querySelector('.guess').value);
document.querySelector('.guess').value = 23; // assign new value to empty input value
console.log(document.querySelector('.guess').value);
*/

// define secret number outside
let secretNumber = Math.trunc(Math.random() * 20) + 1; // NOTE range is int (1~20) now after +1, instead of 0~19
let score = 20;

// helper:
const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

// addEventListener(event, eventHandler)
// should be '.check' not '.btn check'
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value); // can be constant, each click event is a new round

  // When there is no input
  if (!guess) {
    displayMessage('⛔️ No number!');

    // when player wins
  } else if (guess === secretNumber) {
    displayMessage('🎉 Correct Number!');
    document.querySelector('.number').textContent = secretNumber;
    // NOTE change css style:
    document.querySelector('body').style.backgroundColor = '#23bc82';
    document.querySelector('.number').style.width = '30rem'; // NOTE should be specified in a string

    if (Number(document.querySelector('.highscore').textContent) < score) {
      document.querySelector('.highscore').textContent = score;
    }
  } else {
    if (score > 1) {
      // when guess is too high
      if (guess > secretNumber) {
        displayMessage('📈 Too high!');

        // when guess is too low
      } else if (guess < secretNumber) {
        displayMessage('📉 Too low!');
      }
      score--;
    } else {
      displayMessage('💥 You lost the game!');
    }
  }
  document.querySelector('.score').textContent = score;
});

// Select the element with the 'again' class and attach a click event handler
document.querySelector('.again').addEventListener('click', function () {
  // restore initial values of the score and secretNumber variables
  let score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  // Restore the initial conditions of the message, number, score and guess input field
  displayMessage('Start guessing...');
  document.querySelector('.number').textContent = '?';
  document.querySelector('.score').textContent = '20';
  document.querySelector('.guess').value = ''; // NOTE value, not textContent

  // Also restore the original background color (#222) and number width (15rem)
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
});
