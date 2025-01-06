// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let belts = [];
let loader = document.querySelector('.loader-container');
let url = new URL(window.location.href)
let category = url.pathname.split('/')[2].replace('.html','')

// Product container
const container = document.querySelector('.product-container');
const filterCont = document.querySelector('.filter-icon');
const filterList = document.querySelector('.filter-list');
const ascending = document.querySelector('.ascending-order');
const descending = document.querySelector('.descending-order');

if (filterCont) {
  filterCont.addEventListener('click', (e) => {
    filterList.classList.toggle('fl-active');
  });
}

document.addEventListener('click', (e) => {
  if (!filterCont.contains(e.target) && !filterList.contains(e.target)) {
    filterList.classList.remove('fl-active');
  }
});

if (ascending) {
  ascending.addEventListener('click', () => {
    toggleSortOrder('ascending');
  });
}

if (descending) {
  descending.addEventListener('click', () => {
    toggleSortOrder('descending');
  });
}

function toggleSortOrder(order) {
  // If the same button is clicked again, reset the sorting
  if (order === 'ascending' && ascending.classList.contains('fl-ascending')) {
    ascending.classList.remove('fl-ascending');  // Remove the ascending class
    fetchAndDisplayBeltProducts('default');  // Reset to default order
  } else if (order === 'descending' && descending.classList.contains('fl-descending')) {
    descending.classList.remove('fl-descending');  // Remove the descending class
    fetchAndDisplayBeltProducts('default');  // Reset to default order
  } else {
    // Toggle active states for ascending and descending buttons
    if (order === 'ascending') {
      ascending.classList.add('fl-ascending');
      descending.classList.remove('fl-descending');
    } else {
      descending.classList.add('fl-descending');
      ascending.classList.remove('fl-ascending');
    }

    // Close the filter list after selection
    setTimeout(() => {
      filterList.classList.remove('fl-active');
    }, 1000);

    // Re-fetch and display products based on sorting
    fetchAndDisplayBeltProducts(order);
  }
}

// Function to fetch and display featured products
async function fetchAndDisplayBeltProducts(order = 'default') {
  // Show the loader while fetching
  loader.style.display = 'flex';

  // Clear previous product cards
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = `${category.toUpperCase()}`;
  container.appendChild(heading);

  const beltsContainer = document.createElement('div');
  beltsContainer.classList.add('scroll-container');
  container.appendChild(beltsContainer);

  // Fetch featured products from Firestore
  const beltsCollection = collection(db, "leatherProducts");
  const querySnapshot = await getDocs(query(beltsCollection, where("categories", "array-contains", category)));
  belts = [];
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    product.id = doc.id;  // This will add the Firestore document ID to the product object
    belts.push(product);
  });

  // Apply sorting if required (ascending or descending)
  if (order === 'ascending') {
    belts.sort((a, b) => a.price - b.price);  // Sort by price low to high
  } else if (order === 'descending') {
    belts.sort((a, b)=> b.price - a.price);  // Sort by price high to low
  }

  // Render product cards
  belts.forEach((product) => {
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
    productCard.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = `./product.html?id=${product.id}`;
    });
    productImage.addEventListener('mouseover', () => {
      productImage.src = product.image[1];  // Swap to the second image
    });
    productImage.addEventListener('mouseleave', () => {
      productImage.src = product.image[0];  // Revert to the original image
    });

    // Append product card to the container
    beltsContainer.appendChild(productCard);
  });

  // Hide the loader after the products are rendered
  loader.style.display = 'none';
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
fetchAndDisplayBeltProducts();