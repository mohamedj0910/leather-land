// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Product container
const container = document.querySelector('.product-container');
const loader = document.querySelector('.loader');
// Function to fetch and display featured products
async function fetchAndDisplayOtherProducts() {
  const heading = document.createElement('h1');
  heading.textContent = "Other Accessories";
  container.appendChild(heading);

  const othersContainer = document.createElement('div');
  othersContainer.classList.add('scroll-container');
  container.appendChild(othersContainer);

  // Fetch featured products from Firestore
  const otherProductsCollection = collection(db, "leatherProducts");
  const querySnapshot = await getDocs(query(otherProductsCollection, where("categories", "array-contains", "others")));
  const otherProducts = [];
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    product.id = doc.id;  // This will add the Firestore document ID to the product object
    otherProducts.push(product);
  });

  // Loop through the fetched products and create product cards
  otherProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Create product card HTML
    productCard.innerHTML = `
      <div class="image-div">
        <img class="product-image" src="${product.image[0]}" alt="${product.id}">
      </div>
      <div class="details-div">
        <h2 class="product-name"><a href="../pages/product.html?id=${product.id}">${capitalizeProductName(product.product_name)}</a></h2>
        <div class="price-rating">
      <div class="rating">
        <span>${product.rating}</span> <i class="fa fa-star"></i>
      </div>
      <div class="price">₹${formatPrice(product.price)}</div>
    </div>
      </div>
    `;

    // Add hover functionality for swapping images
    const productImage = productCard.querySelector('.product-image');

    productCard.addEventListener('click',(e)=>{
      e.preventDefault();
      window.location.href = `./product.html?id=${product.id}`
    });

    productImage.addEventListener('mouseenter', () => {
      productImage.src = product.image[1];  // Swap to the second image
    });
    productImage.addEventListener('mouseleave', () => {
      productImage.src = product.image[0];  // Revert to the original image
    });

    // Append product card to the container
    othersContainer.appendChild(productCard);
  });
}

// Function to capitalize product name
function capitalizeProductName(name) {
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Function to format the price with commas (Indian Standard)
function formatPrice(price) {
  return price.toLocaleString('en-IN'); // Indian locale formatting
}

// Fetch and display featured products when page loads
fetchAndDisplayOtherProducts();
