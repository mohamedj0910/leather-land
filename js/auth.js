// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmPY0O2PPJuvMDtyA4snO-lqTYlllnxfg",
  authDomain: "register-form-practice.firebaseapp.com",
  projectId: "register-form-practice",
  storageBucket: "register-form-practice.appspot.com",
  messagingSenderId: "69428738471",
  appId: "1:69428738471:web:605853b64d3034d7721e82"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();




// Handle authentication state changes
onAuthStateChanged(auth, (user) => {
  const signInButton = document.getElementById('signIn');
  const profileButton = document.getElementById('profileButton');
  const cartButton = document.getElementById('cartButton');

  if (user) {
    // User is signed in
    signInButton.style.display = 'none';
    profileButton.style.display = 'block';
    cartButton.style.display = 'block';
    logoutBtn.style.display = 'block';
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
if (signUpForm) {
  signUpForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
      const email = document.getElementById('new-username').value;
      const password = document.getElementById('new-password').value;
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          alert('Registered successfully! Redirecting to login page.');
          const signInForm = document.getElementById('signInForm');
          const signUpForm = document.getElementById('signUpForm');
          signInForm.style.display = 'block';
          signUpForm.style.display = 'none';
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert('Error: ' + errorMessage);
        })
  });
}

// Sign-in form submit
const loginBtn = document.getElementById('signInButton');
if (loginBtn) {
  loginBtn.addEventListener('click', function (event) {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const previousPage = document.referrer;
        alert('Login successful!');
        window.location.href = previousPage;
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert('Error: ' + errorMessage);
      });
  });
}

// Logout button click
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
      alert("Logging out successfully");
    }).catch((error) => {
      alert("Logout error: ", error);
    });
  });
}