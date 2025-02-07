const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const btnPopup2 = document.querySelector('.btnCart-popup');
const btnPopup3 = document.querySelector('.add-cart-popup');
const btnPopup4 = document.querySelector('.buy-now-popup');

registerLink.addEventListener('click', () => {
  wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
  wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
  wrapper.classList.remove('active-popup');
});

btnPopup2.addEventListener('click', () => {
  wrapper.classList.add('active-popup');
});

btnPopup3.addEventListener('click', () => {
  wrapper.classList.add('active-popup');
});

btnPopup4.addEventListener('click', () => {
  wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
  wrapper.classList.remove('active-popup');
});

document.getElementById('registration-form').addEventListener('submit', function(event) {
 
  document.getElementById('after-register').style.display = 'block';

  
  event.stopPropagation();
});

