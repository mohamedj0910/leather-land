import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";  // Replace with actual config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get the orderId from the URL
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");

if (!orderId) {
  alert("Order ID is missing from the URL.");
  window.location.href = "/";  // Redirect to home page if no orderId is provided
}

// Fetch order data from Firestore using orderId and email (email as document ID)
async function fetchOrderDetails() {
  try {
    const email = localStorage.getItem("email");
    if (!email) {
      alert("User not logged in.");
      return;
    }

    const orderRef = doc(db, "orders", email);
    const orderSnapshot = await getDoc(orderRef);

    if (orderSnapshot.exists()) {
      const orderData = orderSnapshot.data();
      const order = orderData.orders.find(o => o.orderId === orderId);

      if (order) {
        // Populate order details
        document.getElementById("order-id").textContent = orderId;
        document.getElementById("order-status").textContent = order.status;

        // Populate product details
        const productDetailsContainer = document.getElementById("product-details");
        order.items.forEach(product => {
          const productDiv = document.createElement("div");
          productDiv.classList.add("product");

          productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.productName}">
            <div class="product-details">
              <span class="product-name">${product.productName}</span>
              <span class="product-quantity">Quantity: ${product.quantity}</span>
              <span class="product-price">Price: ₹${product.totalPrice}</span>
            </div>
          `;

          productDetailsContainer.appendChild(productDiv);
        });

        // Calculate days since order
        const orderDate = new Date(order.orderDate);
        const currentDate = new Date();
        const timeDiff = currentDate - orderDate;
        const daysSinceOrder = Math.floor(timeDiff / (1000 * 3600 * 24));

        let deliveryMessage;
        if (daysSinceOrder >= 7) {
          deliveryMessage = "Your order has been delivered to the mentioned address.";
        } else {
          deliveryMessage = `Your order will be delivered in ${7 - daysSinceOrder} day${daysSinceOrder === 6 ? '' : 's'}.`;
        }

        document.getElementById("order-delivery-status").textContent = deliveryMessage;
      } else {
        alert("Order not found.");
      }
    } else {
      alert("No orders found for this user.");
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
    alert("Failed to load order details.");
  }
}
function updateAddress(){
    let storedAddressData = JSON.parse(localStorage.getItem('address'));
console.log(storedAddressData);
const fullName = document.getElementById('fullname');
const phone = document.getElementById('phone');
const address = document.getElementById('address');
fullName.textContent += storedAddressData.fullName;
phone.textContent += storedAddressData.phone;
address.textContent += storedAddressData.address;
}
updateAddress()
// Fetch order details on page load
fetchOrderDetails();
