const menu = document.querySelector('.hamburger');
const menuList = document.querySelector('ul');
const icon = document.querySelector('.icon');
const links = document.querySelectorAll('nav ul li a');
const viewHistory = document.getElementById('order-history');
const networkLoader = document.querySelector('.network-loader')
const productContainer = document.querySelector('.content')
const viewProfile = document.getElementById('view-profile')
const profileButton = document.getElementById('profileButton');
const sidebar = document.getElementById('sidebar');
const profileElements = document.querySelectorAll('#sidebar button');


menu.addEventListener('click', () => {
  if (menuList.style.left === '0px') {
    menuList.style.left = '-100dvw';
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-xmark');
    icon.style.color="white";
  }
  else {
    menuList.style.left = '0px';
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
    icon.style.color="crimson";
  }
});

links.forEach(function(link) {
  link.addEventListener('click', () => {
    menuList.style.left = '-100dvw';
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-xmark');
    icon.style.color = "white";
  });
});


profileElements.forEach(function(btn) {
  btn.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });
});



profileButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});


document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !menuList.contains(event.target)) {
    menuList.style.left = '-100dvw';
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-xmark');
    icon.style.color = "white";
  }

    if (!sidebar.contains(event.target) && !profileButton.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});

let topLogo = document.querySelector('.img-div');
topLogo.addEventListener('click',()=>{
  window.location.href = '/';
});

viewHistory.addEventListener('click',(e)=>{
  e.preventDefault();
  window.location.href = '../pages/orderhistory.html';
})

viewProfile.addEventListener('click',()=>{
  window.open("../pages/profile.html", "_blank")
});

//Network loading
if (navigator.onLine) {
    productContainer.style.display = 'block'
    networkLoader.style.display = 'none'
    console.log("The browser is online");
  } else {
    productContainer.style.display = 'none'
    networkLoader.style.display = 'flex'
    console.log("The browser is offline");
  }
  
  window.addEventListener('online', function() {
    productContainer.style.display = 'block'
    networkLoader.style.display = 'none'
    
    console.log("The browser is online");
  });
  
  window.addEventListener('offline', function() {
  productContainer.style.display = 'none'
  networkLoader.style.display = 'flex'
  console.log("The browser is offline");
});

