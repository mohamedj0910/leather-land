import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js"; // Replace with your Firebase config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const goHome = document.querySelector('.go-to-home');

const DELIVERY_FEE = 50;

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");


async function fetchOrderDetails() {
  try {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      alert("User not logged in.");
      window.location.href = "/";
      return;
    }

    if (!orderId) {
      alert("Order ID is missing from the URL.");
      window.location.href = "/";
    }
    const orderRef = doc(db, "orders", uid);
    const orderSnapshot = await getDoc(orderRef);

    if (orderSnapshot.exists()) {
      const orderData = orderSnapshot.data();
      const order = orderData.orders.find(o => o.orderId === orderId);

      if (order) {
        const orderIdContainer = document.getElementById("order-id");
        const orderStatus = document.getElementById("order-status");
        const orderStatusClass = order.status === "Pending" ? "pending" : "completed";
        orderStatus.classList.add(orderStatusClass)
        orderIdContainer.textContent = orderId;
        orderStatus.textContent = order.status;
        const orderDate = new Date(order.orderDate);
        document.getElementById("order-date").textContent = orderDate.toLocaleDateString();

        const deliveryDate = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        document.getElementById("delivery-date").textContent = deliveryDate.toLocaleDateString();

        const productDetailsContainer = document.getElementById("product-details");
        let totalPrice = 0;

        order.items.forEach(product => {
          const productDiv = document.createElement("div");
          productDiv.classList.add("product");

          totalPrice += product.price * product.quantity;

          productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.productName}">
            <div class="product-info">
              <p><strong>Product Name:</strong> ${product.productName}</p>
              <p><strong>Price (each):</strong> ₹${product.price}</p>
              <p><strong>Quantity:</strong> ${product.quantity}</p>
            </div>
          `;

          productDetailsContainer.appendChild(productDiv);
        });

        const finalPrice = totalPrice + DELIVERY_FEE;

        document.getElementById("product-price").textContent = totalPrice;
        document.getElementById("quantity").textContent = order.items.length;
        document.getElementById("delivery-fee").textContent = DELIVERY_FEE;
        document.getElementById("total-price").textContent = finalPrice;

        if (new Date() >= deliveryDate) {
          const updatedOrders = orderData.orders.map(o =>
            o.orderId === orderId ? { ...o, status: "Completed" } : o
          );

          await updateDoc(orderRef, { orders: updatedOrders });
          document.getElementById("order-status").textContent = "Completed";
        }
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

function updateAddress() {
  const address = JSON.parse(localStorage.getItem("address"));
  if (address) {
    document.getElementById("full-name").textContent = address.fullName || "";
    document.getElementById("phone").textContent = address.phone || "";
    document.getElementById("address").textContent = address.address || "";
  }
}

goHome.addEventListener('click',(e)=>{
  e.preventDefault();
  window.location.href = '/'
});

updateAddress();
fetchOrderDetails();