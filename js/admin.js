// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, addDoc,collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";
// Firebase configuration (replace with your own config)


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Move db initialization outside of try block


  async function uploadProductsFromJson() {
    const collectionName = "leatherProducts";
    const jsonUrl = "../data/test.json";
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