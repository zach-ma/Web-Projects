'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
// const btnsShowModal = document.querySelector('.show-modal'); // NOTE limitation of querySelector: only first one will be selected
const btnsShowModal = document.querySelectorAll('.show-modal');
console.log(btnsShowModal);

// helper:
const showModal = function () {
  // method1: remove hidden class
  modal.classList.remove('hidden'); // NOTE no dot for classList, dot is only for selector
  overlay.classList.remove('hidden');

  // method2: reset each class property, too complex, not recommended
  // modal.style.display = 'block';
  // overlay.style.display = 'block';
};

// helper:
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// iterate through all the buttons
for (let i = 0; i < btnsShowModal.length; i++) {
  btnsShowModal[i].addEventListener('click', showModal); // NOTE once the i-th button is clicked, then execute showModal function
}

// NOTE pass the helper function to make it clear and avoid redundant code
// NOTE no () after the function: execute the function after the button is clicked
btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

// NOTE 'Esc' keypress event
document.addEventListener('keydown', function (e) {
  // console.log('a key was pressed');
  // console.log(e);
  console.log(e.key);
  // NOTE we only want to close modal when it's visible, it's visible when class does not contain class hidden
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});
