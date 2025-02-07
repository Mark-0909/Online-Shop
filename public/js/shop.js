function toggleDropDown() {
    const dropdown = document.getElementById("drop-down");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  }
  

  
  function fetchLatestProducts() {
    fetch('/loggedIn_shop')
      .then((response) => response.json())
      .then((products) => {
        
        const container = document.getElementById('productContainer');

        
        container.innerHTML = '';

       
        products.forEach((product, index) => {
          if (index % 4 === 0) {
            const row = document.createElement('div');
            row.classList.add('row');
            container.appendChild(row);
          }

          const template = `
            <a href="/loggedIn_prod1/${product._id}">
              <div class="column">
                <img src="${product.productImages[0]}" height="260px" width="283px">
                <p>${product.productName}</p>
                <p>${product.productPrice}</p>
                <div class="rating">
                  <i class='bx bxs-star'></i>
                  <i class='bx bxs-star'></i>
                  <i class='bx bxs-star'></i>
                  <i class='bx bxs-star'></i>
                  <i class='bx bxs-star'></i>
                  <p>5.0</p>
                </div>
              </div>
            </a>
          `;

       
          container.lastElementChild.innerHTML += template;
        });
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }

  
  fetchLatestProducts();
