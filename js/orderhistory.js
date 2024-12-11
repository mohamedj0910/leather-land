import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js"; // Replace with your Firebase config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch and render order history
async function fetchOrderHistory() {
  const email = localStorage.getItem("email");
  if (!email) {
    alert("User not logged in.");
    window.location.href = "/";
    return;
  }

  try {
    const orderRef = doc(db, "orders", email);
    const orderSnapshot = await getDoc(orderRef);

    if (orderSnapshot.exists()) {
      const orderData = orderSnapshot.data().orders;
      renderOrderHistory(orderData);
    } else {
      document.getElementById("order-list").innerHTML = "<p>No orders found.</p>";
    }
  } catch (error) {
    console.error("Error fetching order history:", error);
    alert("Failed to load order history.");
  }
}

// Render orders in the DOM
function renderOrderHistory(orders) {
  const orderList = document.getElementById("order-list");
  orderList.innerHTML = "";

  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    const orderStatusClass = order.status === "Pending" ? "pending" : "completed";

    orderDiv.innerHTML = `
      <div class="order-header">
        <span>Order ID: ${order.orderId}</span>
        <span class="order-status ${orderStatusClass}">${order.status}</span>
      </div>
      <div class="order-body">
        <div><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</div>
        <div><strong>Items:</strong></div>
        <ul id="order-items"></ul>
      </div>
    `;

    const orderItemsContainer = orderDiv.querySelector("#order-items");
    order.items.forEach(item => {
      const itemLi = document.createElement("li");
      itemLi.classList.add("product-item");
      
      const trackBtn = document.createElement("button");
      trackBtn.classList.add("track-btn");
      trackBtn.innerHTML = "Track order";

      itemLi.innerHTML = `
      <div>
        <img class="product-image" src="${item.image}" alt="${item.productName}">
        <div class="product-details">
          <span class="product-name">${item.productName}</span>
          <span class="product-quantity">Quantity: ${item.quantity}</span>
          <span class="product-price">Price: ₹${item.totalPrice}</span>
        </div>
        </div>
      `;

      trackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `../pages/order-status.html?orderId=${order.orderId}`;
      });

      itemLi.appendChild(trackBtn);
      orderItemsContainer.appendChild(itemLi);
    });

    orderList.appendChild(orderDiv);
  });
}

// Fetch order history on page load
fetchOrderHistory();
