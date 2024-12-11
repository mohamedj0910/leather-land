// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js"; // Your Firebase config file
import { checkState } from "./productpagestatecheck.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let selectedSize = false;
let size ;
// Get product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
console.log(productId);
const sizeError = document.getElementById('size-error');
// Select the container where the product details will be displayed
const productContainer = document.querySelector('.product-container');

// Fetch and display the product
async function fetchAndDisplayProduct() {
  if (!productId) {
    productContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }

  try {
    const productRef = doc(db, "leatherProducts", productId); // "products" collection in Firestore
    const productSnapshot = await getDoc(productRef);

    if (productSnapshot.exists()) {
      const productData = productSnapshot.data();
      console.log(productData);
      // Update product details
      document.getElementById("product-name").innerText = productData.product_name.toUpperCase();
      document.getElementById("product-price").innerText = formatPrice(productData.price);
      document.getElementById("product-availability").innerText =
        productData.stock_availability ? "In Stock" : "Out of Stock";
      document.getElementById("product-description").innerText = productData.description;

      // Set main image and create thumbnails
      const mainImageElement = document.getElementById("main-image");
      const thumbnailContainer = document.querySelector(".thumbnail-container");
      mainImageElement.src = productData.image[0]; // Default main image
      thumbnailContainer.innerHTML = productData.image
        .map(
          (img, index) =>
            `<img class="thumbnail ${index === 0 ? "active" : ""}" src="${img}" alt="Thumbnail" data-src="${img}">`
        )
        .join("");

      // Handle thumbnail click
      const thumbnails = document.querySelectorAll(".thumbnail");
      thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", (e) => {
          mainImageElement.src = e.target.dataset.src;
          // Update active thumbnail
          thumbnails.forEach((thumb) => thumb.classList.remove("active"));
          e.target.classList.add("active");
        });
      });

      // Check if product has size options
      if (productData.size && productData.size.length > 0) {
        const sizeOptionsDiv = document.getElementById("size-buttons");
        sizeOptionsDiv.innerHTML = productData.size
          .map(
            (size) =>
              `<button class="size-btn" data-size="${size}">${size}</button>`
          )
          .join("");

        // Add size selection logic
        const sizeButtons = document.querySelectorAll(".size-btn");
        sizeButtons.forEach((button) => {
          button.addEventListener("click", () => {
            sizeError.textContent = '';
            sizeButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            selectedSize = true;
            size = button.dataset.size;
            console.log(`Selected size: ${button.dataset.size}`);
          });
        });
      } else {
        // Hide the size options section if the product doesn't have sizes
        document.getElementById("size-options").style.display = 'none';
        // Set selectedSize to true, since there's no size selection required
        selectedSize = true;
      }

      // Add to Cart functionality
      // const cartBtn = document.querySelector('.add-to-cart');
      // const cartCountElement = document.querySelector('.cart-count');
      // cartCountElement.textContent = 0;

      // cartBtn.addEventListener('click', async function() {
      //   try {
      //     const isSignedIn = await checkState();  // Wait for the authentication state check
      //     if (isSignedIn) {
      //       // Get the current count, increment it, and update the cart count
      //       let count = parseInt(cartCountElement.textContent, 10);  // Convert text content to number
      //       count = isNaN(count) ? 0 : count;  // Check if NaN and reset to 0 if necessary
      //       count++;  // Increment the count
      //       cartCountElement.textContent = count;
      //     } else {
      //       alert('You are not signed in!');
      //       // Redirect to sign-up/login page if the user is not signed in
      //       window.location.href = '../pages/signupAndLogin.html';
      //     }
      //   } catch (error) {
      //     alert("An error occurred while checking your authentication status.");
      //     console.error("Error in handleCart:", error);
      //   }
      // });

      // Buy Now functionality
      const buyBtn = document.querySelector('.buy-now');
      buyBtn.addEventListener('click', async function() {
        try {
          const isSignedIn = await checkState();  // Wait for the authentication state check
          if (isSignedIn) {
            if (selectedSize) {
              if(size){
                window.location.href = `./checkout.html?id=${productId}&size=${size}`;
              }
              else{
                window.location.href = `./checkout.html?id=${productId}`;
              }
            } else {
              sizeError.textContent = 'Size not selected';
            }
          } else {
            alert('You are not signed in!');
            // Redirect to sign-up/login page if the user is not signed in
            window.location.href = '../pages/signupAndLogin.html';
          }
        } catch (error) {
          alert("An error occurred while checking your authentication status.");
          console.error("Error in handleCart:", error);
        }
      });

    } else {
      productContainer.innerHTML = "<p>Product not found.</p>";
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    productContainer.innerHTML = "<p>Failed to load product details. Please try again later.</p>";
  }
}

// Function to format the price with commas (Indian Standard)
function formatPrice(price) {
  return price.toLocaleString('en-IN'); // Indian locale formatting
}

// Call the function to fetch product details
fetchAndDisplayProduct();