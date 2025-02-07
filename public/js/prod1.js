/*PROD1 START*/

var slides = document.querySelectorAll('.markslides-prod1 img');
var dots = document.querySelectorAll('.markdotsContainer .dot');
var currentSlideIndex = 0;
function showSlide() {
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  for (var i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }
  slides[currentSlideIndex].style.display = 'block';
  dots[currentSlideIndex].classList.add('active');
}
function nextSlide() {
  currentSlideIndex++;
  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  }
  showSlide();
}
function prevSlide() {
  currentSlideIndex--;
  if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1;
  }
  showSlide();
}
showSlide();
document.querySelector('.next').addEventListener('click', nextSlide);
document.querySelector('.prev').addEventListener('click', prevSlide);
for (var i = 0; i < dots.length; i++) {
  dots[i].addEventListener('click', function() {
    currentSlideIndex = parseInt(this.getAttribute('attr'));
    showSlide();
  });
}
var transitionDuration = 5000; // 1 second
var transitionInterval = setInterval(nextSlide, transitionDuration);

/*PROD1 END*/

document.getElementById("continue-btn").addEventListener("click", function() {
  var afterRegisterDiv = document.getElementById("after-register");
  afterRegisterDiv.style.display = "none";
});





const radioButtons = document.querySelectorAll('input[type="radio"]');


radioButtons.forEach(radio => {
  radio.addEventListener('change', () => {
   
    const labels = document.querySelectorAll('.variations label');
    labels.forEach(label => {
      label.classList.remove('selected');
    });

   
    const selectedLabel = radio.closest('label');
    selectedLabel.classList.add('selected');
  });
});  




function showBuyNowForm() {
  const buyNowForm = document.getElementById("buyNowForm");
  buyNowForm.style.display = "block";
}

function hideBuyNowForm() {
  const buyNowForm = document.getElementById("buyNowForm");
  buyNowForm.style.display = "none";
}



function showAddForm() {
  const addForm = document.querySelector('.Addform');
  addForm.style.display = 'block';
}


function hideAddForm() {
  const addForm = document.querySelector('.Addform');
  addForm.style.display = 'none';
}


const buyNowButton = document.getElementById('buyNowButton');


buyNowButton.addEventListener('click', function(event) {
  
  showAddForm();
});


const closeButton2 = document.getElementById('closeButton2');


closeButton2.addEventListener('click', function(event) {
  
  hideAddForm();
});



function toggleDropDown() {
  const dropdown = document.getElementById("drop-down");
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}



