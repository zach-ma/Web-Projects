'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-25T14:11:59.604Z',
    '2021-05-26T17:01:17.194Z',
    '2021-05-27T23:36:17.929Z',
    '2021-05-28T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-04-05T16:33:06.386Z',
    '2021-05-23T14:43:26.374Z',
    '2021-05-25T18:49:59.371Z',
    '2021-05-28T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.abs(date2 - date1) / (1000 * 24 * 60 * 60);

  const daysPassed = Math.round(calcDaysPassed(date, new Date()));
  console.log('Days Passed:', daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0); // NOTE +1
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency, // currency: 'EUR',
  }).format(value);
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = ''; // NOTE innerHTML, clean the container before adding elements

  // DELETE
  console.log(account);

  // BUG
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b) // NOTE we should not mutate the original, so we create a shallow copy
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[i]); // NOTE

    const displayDate = formatMovementDate(date, account.locale);

    const formattedMov = formatCur(mov, account.locale, account.currency);

    // use template literal for html strings
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html); // NOTE
    // containerMovements.insertAdjacentHTML('beforeend', html);
  });
};
// displayMovements(currentAccount.movements);
console.log(containerMovements.innerHTML);

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (acc, cur, i, arr) => acc + cur,
    0
  );

  // const formattedMov = formatCur(
  //   account.balance,
  //   account.locale,
  //   account.currency
  // );

  // labelBalance.textContent = `${account.balance.toFixed(2)}€`;

  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};
// calcDisplayBalance(currentAccount.movements);

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumIn.textContent = formatCur(incomes, account.locale, account.currency);

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    // NOTE:
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1; // only interest at least 1 will be added
    })
    .reduce((acc, int) => acc + int, 0);
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency
  );
};
// calcDisplaySummary(currentAccount.movements);

const updateUI = function (acc) {
  // Display movements, balance, and summary
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) // NOTE
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);

const startLogOutTimer = function () {
  // Set time to 5 minutes
  let time = 60 * 2; // second based

  // NOTE
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      currentAccount = null;
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }

    // Decrease 1 sec
    time--;
  };

  // NOTE NOTE NOTE to start counting immediately we must separate the function and call it once before the setInterval
  tick();
  // Call the timer every second
  const timer = setInterval(tick, 1000);

  return timer; // NOTE NOTE NOTE we need a timer variable for deleting purpose when a timer already exists
};

/////////////////////////////////////////////////
// Event Handlers
let currentAccount, timer; // NOTE NOTE NOTE timer should be global

// DELETE
// // Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// // DELETE
// // experimenting with API
// const now = new Date();

btnLogin.addEventListener('click', function (e) {
  // NOTE since it is a 'form' element, by default the web will reload when click the button,
  //      we need to avoid this by adding a 'event' param
  // NOTE 1. prevent form from submitting 2. hiting enter in two forms will trigger click event
  e.preventDefault();
  // console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  // optional chaining ?.
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;

    // Create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //////////////
    //Internationalizing Dates
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      // month: 'long',
      month: 'numeric',
      // month: '2-digit',
      year: 'numeric',
      // weekday: 'long',
      // weekday: 'short',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const locale = navigator.language; // NOTE
    // console.log(locale);
    // labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now); // NOTE

    // labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now); // language-country
    // labelDate.textContent = new Intl.DateTimeFormat('pt-PT', options).format(now);
    // labelDate.textContent = new Intl.DateTimeFormat('en-GB').format(now); // language-country
    // labelDate.textContent = new Intl.DateTimeFormat('ar-SY').format(now); // language-country
    //////////////

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''; // NOTE trick!!! assigns from right to left
    inputLoginUsername.blur();
    inputLoginPin.blur(); // NOTE make cursor lose focus

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    if (timer) clearInterval(timer); // NOTE clear timer if there exists one
    timer = startLogOutTimer(); // set timer to new timer

    console.log('LOG IN');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  // check if amount and username are valid
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc && // NOTE check existence
    receiverAcc?.username !== currentAccount.username // check if transfer to currentAccount
  ) {
    // console.log('Transfer Valid');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer NOTE need to reset timer if user is active
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Delete');

  if (
    // check correctness of credentials
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // NOTE findIndex()
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete account
    accounts.splice(index, 1);
    console.log(accounts);

    // Log out, hide UI
    containerApp.style.opacity = 0;
  }

  // Clear input fields
  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();

  // Reset timer
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(Number(inputLoanAmount.value));
  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    // Add timer
    setTimeout(function () {
      // Add positive movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }, 2000);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  // Reset timer
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
});

let sorted = false; // NOTE
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

///////////////////////////////////////
// Converting and Checking Numbers

console.log(23 === 23.0);
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

console.log(Number('23'));
console.log(+'23'); // NOTE trick with +

// Parsing
console.log(Number.parseInt('30px', 10)); // NOTE must start with number, base = 10
console.log(Number.parseInt('e23', 10));

console.log(Number.parseInt('   2.5rem  '));
console.log(Number.parseFloat('   2.5rem   ')); // NOTE

// Check if value is NaN (not a number type)
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0)); // infinity

// NOTE .isFinite() best way for checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0)); // infinity

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));

///////////////////////////////////////
// Math and Rounding
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));
console.log(Math.max(5, 18, '23px', 11, 2));
console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min; //NOTE
// 0...1 -> 0...(max - min) -> min...max
console.log(randomInt(10, 20));

// Rounding integers
console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor('23.9'));

console.log(Math.trunc(23.3));

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// Rounding decimals
// .toFixed() returns a string
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));

///////////////////////////////////////
// The Remainder Operator
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     // 0, 2, 4, 6
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     // 0, 3, 6, 9
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

///////////////////////////////////////
// Working with BigInt

// biggest num that can be accurately and safely represented
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);

console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

// NOTE
console.log(4838430248342043823408394839483204n); // 'n' convert to bigInt
console.log(BigInt(48384302));

// Operations
console.log(10000n + 10000n);
console.log(36286372637263726376237263726372632n * 10000000n);
// console.log(Math.sqrt(16n)); // does NOT work
const huge = 20289830237283728378237n;
const num = 23;
// console.log(huge * num); // can NOT mix
console.log(huge * BigInt(num));

// Exceptions
// 1. logic operator
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');
// 2. string concat
console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(11n / 3n); // will simply cut the decimal point
console.log(10 / 3);

///////////////////////////////////////
// Creating Dates

// Create a date
const now2 = new Date();
console.log(now2);

console.log(new Date('May 02 2021 11:31:50'));
console.log(new Date('May 02, 2021 '));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5)); // month is zero based
console.log(new Date(2037, 10, 31)); // convert to next month

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 1000)); // 3 days later, by using mili seconds

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate()); // day of the month
console.log(future.getDay()); // day of the week
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString()); // NOTE to store in somewhere
console.log(future.getTime()); // in milisecond NOTE

console.log(new Date(future.getTime()));

console.log(Date.now());

future.setFullYear(2040); // change the year
console.log(future);

// Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 24 * 60 * 60);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 4));
console.log(days1);

///////////////////////////////////////
// Internationalizing Numbers (Intl)
const num2 = 3884764.23;

const options = {
  style: 'currency',
  // style: 'unit',
  // style: 'percent',
  // unit: 'mile-per-hour',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,
};

console.log('US:      ', new Intl.NumberFormat('en-US', options).format(num2));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num2));
console.log('Syria:   ', new Intl.NumberFormat('ar-SY', options).format(num2));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);

///////////////////////////////////////
// Timers

// setTimeout
const ingredients = ['olives'];
// const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza🍕 with ${ing1} and ${ing2}`),
  3000, // 3 secs later
  // all the lines after time are parameters
  ...ingredients
);
console.log('Waiting...');
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000); // every 1 seconds
