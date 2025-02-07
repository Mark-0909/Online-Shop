



  document.addEventListener('DOMContentLoaded', function() {
    const cancelButtons = document.querySelectorAll('.cancelOrderButton');

    cancelButtons.forEach(function(cancelButton) {
      cancelButton.addEventListener('click', function() {
        const orderId = cancelButton.getAttribute('data-order-id');
        cancelOrder(orderId);
      });
    });

    function cancelOrder(orderId) {
      
      fetch(`/cancelOrder/${orderId}`, {
        method: 'DELETE'
      })
      .then(function(response) {
        if (response.ok) {
      
          const successMessage = document.querySelector('.successRemove');
          successMessage.style.display = 'block';

       
          setTimeout(function() {
            location.reload();
          }, 1000);
        } else {
          console.error('Failed to cancel the order');
        }
      })
      .catch(function(error) {
        console.error(error);
      });
    }
  });

const popupElement = document.querySelector('.successRemove');


function updatePopupMarginTop(marginTopValue) {
  popupElement.style.marginTop = marginTopValue;
}


updatePopupMarginTop('150px');



  function calculateTotalPrice(item) {
    let totalPrice = 0;
    item.cartItems.forEach(cartItem => {
      totalPrice += cartItem.totalPrice;
    });
    return totalPrice;
  }

 
  
  
  function toggleOrderDetails(orderId) {
    const orderDropdown = document.getElementById(`orderDropdown_${orderId}`);
    
    if (orderDropdown.style.display === 'none') {
      orderDropdown.style.display = 'block';
    } else {
      orderDropdown.style.display = 'none';
    }
  }

  
  function toggleDropDown() {
    const dropdown = document.getElementById("drop-down");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  }
  