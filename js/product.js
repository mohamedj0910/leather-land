// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Select the container where the product details will be displayed
const productContainer = document.querySelector('.product-container');

// Fetch and display the product
async function fetchAndDisplayProduct() {
  if (!productId) {
    productContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }

  try {
    // Reference the product document by ID
    const productRef = doc(db, "leatherProducts", productId);
    const productSnapshot = await getDoc(productRef);

    if (productSnapshot.exists()) {
      const productData = productSnapshot.data();
      
      // Construct product display
      productContainer.innerHTML = `
        <div class="product-details">
          <h1>${productData.product_name}</h1>
          <div class="image-div">
            <img src="${productData.image}" alt="${productData.product_name}">
          </div>
          <p><strong>Price:</strong> ₹${productData.price}</p>
          <p><strong>Description:</strong> ${productData.description}</p>
          <!-- Add more details as needed -->
        </div>
      `;
    } else {
      productContainer.innerHTML = "<p>Product not found.</p>";
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    productContainer.innerHTML = "<p>Failed to load product details. Please try again later.</p>";
  }
}

// Call the function to fetch and display the product
fetchAndDisplayProduct();
