// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { firebaseConfig } from "./config.js"; // Firebase config (replace with your actual config)

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Function to check if the user is signed in
export function checkState() {
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
