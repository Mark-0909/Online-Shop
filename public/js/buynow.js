const radioButtons = document.querySelectorAll('input[type="radio"]');


radioButtons.forEach(radio => {
  radio.addEventListener('change', () => {
    
    const labels = document.querySelectorAll('.variations2 label');
    labels.forEach(label => {
      label.classList.remove('selected');
    });


    const selectedLabel = radio.closest('label');
    selectedLabel.classList.add('selected');
  });
});  




const inputNum = document.querySelector('.inputnum');
const productPriceElement = document.getElementById('productPrice');
const shippingFeeElement = document.getElementById('shippingFee');
const totalPriceElement = document.getElementById('totalPrice');

inputNum.addEventListener('input', calculateTotal);
document.getElementById('region').addEventListener('change', calculateTotal);

function calculateTotal() {
  const quantity = inputNum.value;
  const productPrice = parseFloat(productPriceElement.dataset.price);
  const shippingFee = parseFloat(document.getElementById('region').value);

  const total = quantity * productPrice + shippingFee;
  totalPriceElement.textContent = `₱ ${total.toFixed(2).replace(/\.00$/, '')}`;

  shippingFeeElement.textContent = `₱ ${shippingFee.toFixed(2).replace(/\.00$/, '')}`;

 
  const productPriceTotal = quantity * productPrice;
  productPriceElement.textContent = `₱ ${productPriceTotal.toFixed(2).replace(/\.00$/, '')}`;
}

function toggleDropDown() {
  const dropdown = document.getElementById("drop-down");
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}
