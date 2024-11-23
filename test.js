// Import the necessary Firebase services
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { firebaseConfig } from './js/config.js';
// Your Firebase configuration (get this from your Firebase console)


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Reference to your Firestore collection (assuming it's called 'products')
const productsRef = collection(db, 'leatherProducts');

// Function to fetch and display products
async function fetchAndDisplayProducts() {
    const querySnapshot = await getDocs(productsRef);
    querySnapshot.forEach((doc) => {
        // Get the product data from Firestore
        const product = doc.data();
        const div = document.createElement('div')
        const images = product.image;
        images.forEach(img => {
            div.innerHTML +=   `<img src="${img}" height = "200">`
        })
        // Create a new image element for each product
        
        // Append the image element to the img-cont div
        const imgCont = document.getElementById('img-cont');
        imgCont.appendChild(div);
    });
}

// Call the function to fetch and display products
fetchAndDisplayProducts();
