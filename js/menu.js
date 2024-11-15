const menu = document.querySelector('.hamburger');
const menuList = document.querySelector('ul');
const icon = document.querySelector('.icon');
const links = document.querySelectorAll('nav ul li a');
menu.addEventListener('click', () => {
  if (menuList.style.left === '0px') {
    menuList.style.left = '-100dvw';
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-xmark');
    icon.style.color="white";
  } else {
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

const profileButton = document.getElementById('profileButton');
const sidebar = document.getElementById('sidebar');

// Toggle sidebar on profile icon click
profileButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Optionally, close sidebar if clicking outside of it
document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !profileButton.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});
