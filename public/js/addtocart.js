
function deleteCartItem(cartItemId) {

  fetch(`/loggedIn_cart/${cartItemId}`, { method: 'DELETE' })
    .then((response) => response.json())
    .then((data) => {
     
      showSuccessMessage();

     
      location.reload();
    })
    .catch((error) => {
      console.error('Error deleting cart item:', error);
    });
}


function showSuccessMessage() {
  const successRemoveElement = document.createElement('div');
  successRemoveElement.classList.add('successRemove');
  successRemoveElement.innerHTML = `
    <i class='bx bx-check-circle'></i>
    <p>The item was removed.</p>
  `;
  document.body.appendChild(successRemoveElement);

  
  successRemoveElement.style.position = 'fixed';
  successRemoveElement.style.top = '400px';
  successRemoveElement.style.left = '250px';
  

  setTimeout(() => {
    successRemoveElement.remove();
  }, 2500);
}


function fetchLatestCartItems() {
  fetch('/loggedIn_cart')
    .then((response) => response.json())
    .then((cartItems) => {
      const cartItemContainer = document.getElementById('cartItemContainer');
      cartItemContainer.innerHTML = '';

      if (cartItems.length === 0) {
        const noItemElement = document.createElement('div');
        noItemElement.classList.add('noItem');
        noItemElement.innerHTML = `
          <p>No items added yet</p>
          <a href="/loggedIn_shop/<%= userIdentifier %>">Go to Products</a>
        `;
        cartItemContainer.appendChild(noItemElement);
      } else {
        cartItems.forEach((cartItem) => {
          const product = products.find((p) => p._id.toString() === cartItem.productId.toString());

          const cartItemElement = document.createElement('div');
          cartItemElement.classList.add('items', 'cart-item');
          cartItemElement.id = `cartItemContainer_${cartItem._id}`;
          cartItemElement.innerHTML = `
            <input type="radio" name="item" value="addeditem" id="addeditem">
            <label for="addeditem">
              <img class="pictureniya" src="/<%= product.productImages[0] %>">
              <p class="titleNgProduct">
                <a href="/loggedIn_prod1/<%= userIdentifier %>/<%= product._id %>">${product.productName}</a>
              </p>
              <img class="kulayniya" src="/<%= product.productImages[cartItem.selectedOption + 3] %>" alt="">
              <p id="bilangngproduct">X ${cartItem.quantity}</p>
              <p class="presyoNgProduct">₱ ${product.productPrice * cartItem.quantity}</p>
              <a class="removeBTN" href="javascript:void(0)" onclick="deleteCartItem('${cartItem._id}')">
                <i class='bx bx-trash'></i>
              </a>
            </label>
          `;
          cartItemContainer.appendChild(cartItemElement);
        });

       
        const deleteButtons = document.getElementsByClassName('removeBTN');
        for (let i = 0; i < deleteButtons.length; i++) {
          const deleteButton = deleteButtons[i];
          deleteButton.addEventListener('click', deleteButtonClickHandler);
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching cart items:', error);
    });
}


function deleteButtonClickHandler(event) {
  event.preventDefault();
  const cartItemId = event.target.getAttribute('data-cartItemId');
  deleteCartItem(cartItemId);
}


fetchLatestCartItems();


function toggleItemSelection(cartItemId) {
  const cartItemContainer = document.getElementById(`cartItemContainer_${cartItemId}`);
  cartItemContainer.classList.toggle('selected');
}





function toggleItemSelection(cartItemId) {
  const cartItemContainer = document.getElementById(`cartItemContainer_${cartItemId}`);
  cartItemContainer.classList.toggle('selected');

  const selectedItems = document.querySelectorAll('.items.selected');
  const totalPriceElement = document.querySelector('.totalwithoutshipping p');
  let totalPrice = 0;

  selectedItems.forEach((item) => {
    const priceElement = item.querySelector('.presyoNgProduct');
    const price = parseFloat(priceElement.innerText.replace('₱', ''));
    totalPrice += price;
  });

  totalPriceElement.innerText = `₱ ${totalPrice.toFixed(2)}`;

  const placeOrderElement = document.querySelector('.placeOrder');
  if (selectedItems.length > 0) {
    placeOrderElement.style.display = 'block';

    
    const placeOrderTotalPrice = placeOrderElement.querySelector('#totalPrice');
    placeOrderTotalPrice.innerText = `₱ ${totalPrice.toFixed(2)}`;

   
    const placeOrderLink = placeOrderElement.querySelector('.placeOrderButton');
    const summationElement = placeOrderElement.querySelector('.totalkase');

    placeOrderLink.style.fontSize = '30px';
    summationElement.style.marginTop = '-15px';
  } else {
    placeOrderElement.style.display = 'none';
  }
}


function updateShippingFee() {
  const regionSelect = document.querySelector('.custRegion select');
  const shippingFeeElement = document.querySelector('.shippingfee .SFee');
  const totalWithoutShippingElement = document.querySelector('.totalwithoutshipping p');
  const totalWithShippingElement = document.querySelector('.totalwithshipping .ovalltot');

  const selectedRegion = regionSelect.value;
  let shippingFee = 0;

  if (selectedRegion === '75') {
    shippingFee = 75;
  } else if (selectedRegion === '100') {
    shippingFee = 100;
  } else if (selectedRegion === '150') {
    shippingFee = 150;
  }

  shippingFeeElement.innerText = `₱ ${shippingFee}`;

  const totalWithoutShipping = parseFloat(totalWithoutShippingElement.innerText.replace('₱', ''));
  const totalWithShipping = totalWithoutShipping + shippingFee;

  totalWithShippingElement.innerText = `₱ ${totalWithShipping.toFixed(2)}`;
}


const regionSelect = document.querySelector('.custRegion select');
regionSelect.addEventListener('change', updateShippingFee);



function handlePlaceOrder(event) {
  event.preventDefault(); 

  const placeOrderElement = document.querySelector('.placeOrder');
  const deliveryDetailsElement = document.querySelector('.delivDetails');

  placeOrderElement.style.display = 'none';
  deliveryDetailsElement.style.display = 'block';
}


const placeOrderForm = document.getElementById('placeOrderForm');
const placeOrderButton = placeOrderForm.querySelector('.placeOrderButton');
placeOrderButton.addEventListener('click', handlePlaceOrder);


function handleCloseDeliveryDetails(event) {
  event.preventDefault(); 

  const placeOrderElement = document.querySelector('.placeOrder');
  const deliveryDetailsElement = document.querySelector('.delivDetails');

  placeOrderElement.style.display = 'block';
  deliveryDetailsElement.style.display = 'none';
}


const closeDeliveryButton = document.querySelector('.closedelivFormBTN');
closeDeliveryButton.addEventListener('click', handleCloseDeliveryDetails);

function toggleDropDown() {
  const dropdown = document.getElementById("drop-down");
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}
