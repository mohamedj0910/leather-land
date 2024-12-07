import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Elements
const orderItemsContainer = document.getElementById("order-items");
const subtotalElem = document.getElementById("subtotal");
const totalElem = document.getElementById("total");
const addressForm = document.getElementById("address-form");

// Fetch and display product details
async function fetchProductDetails() {
  if (!productId) return;

  try {
    const productRef = doc(db, "leatherProducts", productId);
    const productSnapshot = await getDoc(productRef);

    if (productSnapshot.exists()) {
      const product = productSnapshot.data();
      const basePrice = product.price;

      // Render order summary
      orderItemsContainer.innerHTML = `
        <tr>
          <td>
            <img src="${product.image[0]}" alt="${product.product_name}" style="width: 50px;"> 
            ${product.product_name}
          </td>
          <td>₹<span class="base-price">${basePrice}</span></td>
          <td>
            <button class="quantity-btn" data-action="decrease">-</button>
            <input class="quantity-input" type="text" value="1" readonly>
            <button class="quantity-btn" data-action="increase">+</button>
          </td>
          <td>₹<span class="total-price">${basePrice}</span></td>
        </tr>
      `;

      updateTotals(basePrice, 1);
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

// Update totals dynamically
function updateTotals(basePrice, quantity) {
  const subtotal = basePrice * quantity;
  const deliveryFee = 50; // Example delivery fee
  const total = subtotal + deliveryFee;

  subtotalElem.innerText = subtotal;
  totalElem.innerText = total;

  // Update the row's total price
  document.querySelector(".total-price").innerText = basePrice * quantity;
}

// Handle quantity change
orderItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("quantity-btn")) {
    const action = e.target.dataset.action;
    const quantityInput = e.target.closest("td").querySelector(".quantity-input");
    const totalPriceElem = e.target.closest("tr").querySelector(".total-price");
    const basePrice = parseInt(
      e.target.closest("tr").querySelector(".base-price").innerText,
      10
    );
    let quantity = parseInt(quantityInput.value, 10);

    // Adjust quantity based on the action
    if (action === "increase" && quantity < 10) quantity++;
    else if (action === "decrease" && quantity > 1) quantity--;

    quantityInput.value = quantity;
    if(quantity>10){
      
    }
    updateTotals(basePrice, quantity);
  }
});

// Save address
async function saveAddress(e) {
  e.preventDefault();

  const fullName = document.getElementById("full-name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  if (!fullName || !phone || !address) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const userRef = doc(db, "users", "currentUserId"); // Replace with logged-in user ID
    await updateDoc(userRef, {
      fullName,
      phone,
      address,
    });

    alert("Address updated successfully!");
  } catch (error) {
    console.error("Error updating address:", error);
    alert("Failed to update address.");
  }
}

// Event listeners
addressForm.addEventListener("submit", saveAddress);
fetchProductDetails();