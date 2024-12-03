// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { firebaseConfig } from "./config.js"; // Firebase config (replace with your actual config)

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
// DOM Elements
const cartBtn = document.querySelector('.add-to-cart');

// Event Listener for the "Add to Cart" button
cartBtn.addEventListener('click', handleCart);

// Function to check if the user is signed in
function checkState() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                resolve(true);
            } else {
                // User is signed out
                resolve(false);
            }
        }, (error) => {
            // Handle error if authentication state changes fail
            console.error("Error checking auth state: ", error);
            reject(error);
        });
    });
}

const buyBtn = document.querySelector('.buy-now');
buyBtn.addEventListener('click',handleBuynow)
async function handleBuynow() {
    try {
        const isSignedIn = await checkState();  // Wait for the authentication state check
        if (isSignedIn) {
            window.location.href = `./checkout.html?id=${productId}`
        } else {
            alert('You are not signed in!');  // Logic for signed-out user
            // Redirect to sign-up/login page if the user is not signed in
            window.location.href = '../pages/signupAndLogin.html';
        }
    } catch (error) {
        alert("An error occurred while checking your authentication status.");
        console.error("Error in handleCart:", error);
    }
}

// Function to handle cart button click
const cartCountElement = document.querySelector('.cart-count');
cartCountElement.textContent = 0;
async function handleCart() {
    try {
        const isSignedIn = await checkState();  // Wait for the authentication state check
        if (isSignedIn) {
            // Get the current count, convert it to a number, increment it, and update the text content
            let count = parseInt(cartCountElement.textContent, 10);  // Convert text content to number
            count = isNaN(count) ? 0 : count;  // Check if NaN and reset to 0 if necessary
            count++;  // Increment the count
            cartCountElement.textContent = count;  // Update the cart count display
            // alert('You are signed in!'); 
             // Logic for signed-in user
        } else {
            alert('You are not signed in!');  // Logic for signed-out user
            // Redirect to sign-up/login page if the user is not signed in
            window.location.href = '../pages/signupAndLogin.html';
        }
    } catch (error) {
        alert("An error occurred while checking your authentication status.");
        console.error("Error in handleCart:", error);
    }
}
