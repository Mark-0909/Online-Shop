document.addEventListener("DOMContentLoaded", function () {
  const sliderImages = document.querySelector(".slider-images");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const imageWidth = document.querySelector(".img-container").clientWidth;
  let currentSlide = 0;

  
  prevBtn.addEventListener("click", function () {
      currentSlide--;
      if (currentSlide < 0) {
          currentSlide = sliderImages.childElementCount - 1;
      }
      updateSlider();
  });

  
  nextBtn.addEventListener("click", function () {
      currentSlide++;
      if (currentSlide >= sliderImages.childElementCount) {
          currentSlide = 0;
      }
      updateSlider();
  });

 
  setInterval(function () {
      currentSlide++;
      if (currentSlide >= sliderImages.childElementCount) {
          currentSlide = 0;
      }
      updateSlider();
  }, 10000);

  
  function updateSlider() {
      sliderImages.style.transform = `translateX(-${currentSlide * imageWidth}px)`;
  }
});

var navbar = document.getElementById('prodlink');
var navbarOffset = navbar.offsetTop;

function updateNavbarPosition() {
  if (window.pageYOffset >= navbarOffset) {
    navbar.style.position = 'sticky';
    navbar.style.top = '0';
   
  } else {
    navbar.style.position = 'static';
   
  }
}

window.addEventListener('scroll', updateNavbarPosition);

function toggleDropDown() {
  const dropdown = document.getElementById("drop-down");
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}

