// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let loader = document.querySelector('.loader-container')
// Product containers for different categories
const shoesContainer = document.querySelector('.trending-shoes .product-container');
const beltsContainer = document.querySelector('.trending-belts .product-container');
const walletsContainer = document.querySelector('.trending-wallets .product-container');
const othersContainer = document.querySelector('.trending-others .product-container');

// Function to fetch and display products based on category
async function fetchAndDisplayProducts(category, container) {
  loader.style.display = 'flex';
  const heading = document.createElement('h1');
  heading.classList.add('headings')
  heading.innerHTML = `<span>${capitalizeProductName(category)}</span>`;
  container.appendChild(heading);
  heading.innerHTML += `<a href="./${category}.html">View all</a>`
  const featuredContainer = document.createElement('div');
  featuredContainer.classList.add('scroll-container');
  container.appendChild(featuredContainer);
  
  // Fetch products from Firestore based on the category
  const featuredProductsCollection = collection(db, "leatherProducts");
  const querySnapshot = await getDocs(query(featuredProductsCollection, where("categories", "array-contains", category)));
  const featuredProducts = [];
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    product.id = doc.id;  // Add Firestore document ID to the product object
    featuredProducts.push(product);
  });
  
  // Loop through the fetched products and create product cards
  featuredProducts.forEach((product) => {
    // Ensure the product belongs to the correct category and isn't mistakenly categorized as trendingProduct
    if (product.categories.includes('trendingProduct')) {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      
      // Create product card HTML
      productCard.innerHTML = `
      <div class="image-div">
      <img class="product-image" src="${product.image[0]}" alt="${product.product_name}">
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
      productImage.addEventListener('mouseenter', () => {
        productImage.src = product.image[1];  // Swap to the second image
      });
      productImage.addEventListener('mouseleave', () => {
        productImage.src = product.image[0];  // Revert to the original image
      });
      productCard.addEventListener('click',(e)=>{
        e.preventDefault();
        window.location.href = `./product.html?id=${product.id}`
      });
      // Append product card to the container
      featuredContainer.appendChild(productCard);
      loader.style.display = 'none';
    }
  });
}

// Function to capitalize product names
function capitalizeProductName(name) {
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Function to format the price with commas (Indian Standard)
function formatPrice(price) {
  return price.toLocaleString('en-IN'); // Indian locale formatting
}

// Fetch and display products for each category when page loads
fetchAndDisplayProducts('shoes', shoesContainer);
fetchAndDisplayProducts('belts', beltsContainer);
fetchAndDisplayProducts('wallets', walletsContainer);
fetchAndDisplayProducts('others', othersContainer);
