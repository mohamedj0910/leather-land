// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Product container
const container = document.querySelector('.product-container');
const loader = document.querySelector('.loader-container')

// Function to fetch and display featured products
async function fetchAndDisplayFeaturedProducts() {
  loader.style.display = 'flex'
  const heading = document.createElement('h1');
  heading.textContent = "Featured Products";
  container.appendChild(heading);
  
  const featuredContainer = document.createElement('div');
  featuredContainer.classList.add('scroll-container');
  container.appendChild(featuredContainer);

  // Fetch featured products from Firestore
  const featuredProductsCollection = collection(db, "leatherProducts");
  const querySnapshot = await getDocs(query(featuredProductsCollection, where("categories", "array-contains", "featuredProduct")));
  const featuredProducts = [];
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    product.id = doc.id;  // This will add the Firestore document ID to the product object
    featuredProducts.push(product);
  });
  
  // Loop through the fetched products and create product cards
  featuredProducts.forEach((product) => {
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
        window.location.href = `../pages/product.html?id=${product.id}`
      });
      productCard.addEventListener('mouseenter', () => {
        productImage.src = product.image[1];
      });
      productCard.addEventListener('mouseleave', () => {
        productImage.src = product.image[0];  // Revert to the original image
      });
      
      // Append product card to the container
      featuredContainer.appendChild(productCard);
      loader.style.display = 'none'
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
fetchAndDisplayFeaturedProducts();

