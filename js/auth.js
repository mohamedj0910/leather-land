// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { saveUserDetails, getUserDetailsByEmail } from './users.js';  // Import functions from user.js
import { firebaseConfig } from "./config.js";
// Your Firebase config

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

    // Fetch user details after login
    getUserDetailsByEmail(user.email)
      .then((userDetails) => {
        if (userDetails) {
          // Display user details on the profile page (or wherever you want)
          userDetails.firstName = userDetails.firstName.split("");
          userDetails.firstName[0]=userDetails.firstName[0].toUpperCase();
          userDetails.firstName = userDetails.firstName.join("");
          document.getElementById('display-username').textContent = `${userDetails.firstName} ${userDetails.lastName}`;
          // document.getElementById('profile-phone').textContent = userDetails.phone;
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  } else {
    // User is not signed in
    signInButton.style.display = 'block';
    profileButton.style.display = 'none';
    cartButton.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
});
// Sign-up form submit
const signUpForm = document.getElementById('sign-up-form');
const lengthError = document.querySelector('.length-error');
const lowercaseError = document.querySelector('.lowercase-error');
const uppercaseError = document.querySelector('.upprcase-error');
const numberError = document.querySelector('.number-error');
const spcharError = document.querySelector('.spchar-error');

if (signUpForm) {
  signUpForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const phone = document.getElementById('phone').value;
    lengthError.textContent = '';
    if (password.length < 8) {
      lengthError.textContent = "Password should be at least 8 characters";
    }
    
    loader.style.display = 'inline';
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Save user details after successful registration
        saveUserDetails(firstName, lastName, phone, user.email)
          .then(() => {
            loader.style.display = 'none';
            alert('Registered successfully! Logging in...');
            window.location.href = '/';  // Redirect to homepage or another page
          })
          .catch((error) => {
            loader.style.display = 'none';
            console.error('Error saving user details: ', error);
          });
      })
      .catch((error) => {
        loader.style.display = 'none'
        const errorMessage = error.message;

        lowercaseError.textContent = '';
        uppercaseError.textContent = '';
        numberError.textContent = '';
        spcharError.textContent = '';

        if (errorMessage.includes("Password must contain a numeric character")) {
          numberError.textContent = "Password must include at least one number.";
        }
        if (errorMessage.includes("Password must contain a non-alphanumeric character")) {
          spcharError.textContent = "Password must include at least one special character.";
        }
        if (errorMessage.includes("Password must contain an upper case character")) {
          uppercaseError.textContent = "Password must contain at least one uppercase letter.";
        }
        if (errorMessage.includes("Password must contain a lowercase character")) {
          lowercaseError.textContent = "Password must contain at least one lowercase letter.";
        }
        if (errorMessage.includes("Password should be at least 6 characters")) {
          lengthError.textContent = "Password must be at least 6 characters long.";
        }
      });
  });
}

// Sign-in form submit
const loginForm = document.getElementById('sign-in-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    invalidCred.textContent = '';
    const email = document.getElementById('username');
    const password = document.getElementById('password');
    loader.style.display = 'inline';

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        loader.style.display = 'none';
        const user = userCredential.user;

        // Fetch user details after successful login
        getUserDetailsByEmail(user.email)
          .then((userDetails) => {
            if (userDetails) {
              // Show user details on profile page
              document.getElementById('profile-name').textContent = `${userDetails.firstName} ${userDetails.lastName}`;
              document.getElementById('profile-phone').textContent = userDetails.phone;
            }
          })
          .catch((error) => {
            console.error('Error fetching user details:', error);
          });
        alert("Login successfully")
        window.location.href = '/';  // Redirect to homepage or dashboard

      })
      .catch((error) => {
        loader.style.display = 'none';
        invalidCred.textContent = 'Incorrect password or email';
        email.style.borderColor = 'red';
        password.style.borderColor = 'red';
      });
  });
}

// Logout button
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
      alert("Logged out successfully");
      window.location.href = '/';  // Redirect after logout
    }).catch((error) => {
      alert("Logout error: ", error);
    });
  });
}