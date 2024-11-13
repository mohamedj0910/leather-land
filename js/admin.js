

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, addDoc,collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";
// Firebase configuration (replace with your own config)


// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Move db initialization outside of try block

const container = document.querySelector('.product-container');
async function fetchAndDisplayFeaturedProducts() {
  const heading = document.createElement('h1');
  heading.textContent = "Featured Products"
  container.appendChild(heading);
  const featuredContainer = document.createElement('div');
  featuredContainer.classList.add('scroll-container');

  container.appendChild(featuredContainer);
    const featuredProductsCollection = collection(db, "leatherProducts");
    const querySnapshot = await getDocs(query(featuredProductsCollection, where("categories", "array-contains", "featuredProduct")));
    const featuredProducts = [];
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      product.id = doc.id;  // This will add the Firestore document ID to the product object
      featuredProducts.push(product);
    });
  
    // Clear the hero section before adding new products
  
    featuredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      // Add product details to the card (customize as needed)
      productCard.innerHTML = `
      <div class="image-div">
        <img src="${product.image}" alt="${product.id}">
      </div>
      <div class="details-div">
        <h2><a href="../pages/product.html?id=${product.id}"><h2>${product.product_name}</h2></a></h2>
        <p>₹${product.price}</p>
        <p>${product.description}</p>
      </div>
      `; 
      featuredContainer.appendChild(productCard);
    });
  }
  
  // Call the function to fetch and display featured products
  fetchAndDisplayFeaturedProducts();

  async function uploadProductsFromJson() {
    const collectionName = "leatherProducts";
    const jsonUrl = "../data/products.json";
    const collectionRef = collection(db, collectionName);
    try {
      // Check if the collection is empty
      const snapshot = await getDocs(collectionRef);
      if (snapshot.empty) {
        console.log(`Collection '${collectionName}' is empty or does not exist. Creating collection...`);
        const response = await fetch(jsonUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch product.json: ${response.statusText}`);
        }
    
        const productsData = await response.json();
    
        // Loop through each product and add to Firestore, checking for duplicates
        for (const product of productsData) {
            await addDoc(collectionRef, product)
              .then((docRef) => {
                console.log(`Product added with ID: ${docRef.id}`);
              })
              .catch((error) => {
                console.error(`Error adding product: ${error.message}`);
              });
        }
      } else {
        console.log(`Collection '${collectionName}' already exists. Adding data...`);
      }
  
      // Fetch JSON data from the hosted product.json URL
  
      console.log("Products uploaded to Firestore successfully.");
    } catch (error) {
      console.error("Error uploading products:", error);
    }
  }
// Run the function
uploadProductsFromJson();