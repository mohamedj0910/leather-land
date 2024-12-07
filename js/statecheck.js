// statecheck.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getUserDetailsByEmail } from './users.js';  // Import functions from users.js
import { firebaseConfig } from "./config.js";  // Your Firebase config

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// DOM Elements
const loader = document.querySelector('.fa-spin');
const invalidCred = document.querySelector('.invalid-cred');

// Handle authentication state changes
onAuthStateChanged(auth, (user) => {
  const signInButton = document.getElementById('signIn');
  const profileButton = document.getElementById('profileButton');
  const cartButton = document.getElementById('cartButton');
  const logoutBtn = document.getElementById('logout-btn');

  if (user) {
    // User is signed in
    signInButton.style.display = 'none';
    profileButton.style.display = 'block';
    cartButton.style.display = 'block';
    logoutBtn.style.display = 'block';
    // Fetch user details after login using email as the document ID
    getUserDetailsByEmail(user.email)
    .then((userDetails) => {
      if (userDetails) {
        // Display user details on the profile page
          localStorage.setItem('fname',userDetails.firstName);
          localStorage.setItem('lname',userDetails.lastName);
          localStorage.setItem('email',userDetails.email);
          localStorage.setItem('phone',userDetails.phone);
          userDetails.firstName = userDetails.firstName.split("");
          userDetails.firstName[0] = userDetails.firstName[0].toUpperCase();
          userDetails.firstName = userDetails.firstName.join("");
          
          document.getElementById('display-username').textContent = `Hello...${userDetails.firstName} ${userDetails.lastName}`;
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  } else {
    // User is not signed in
    localStorage.removeItem('fname');
    localStorage.removeItem('lname');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    signInButton.style.display = 'block';
    profileButton.style.display = 'none';
    cartButton.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
});

// Handle logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to logout?")) {
      signOut(auth).then(() => {
        alert("Logged out successfully");
        window.location.href = '/';  // Redirect after logout
      }).catch((error) => {
        alert("Logout error: ", error);
      });
    }
  });
}