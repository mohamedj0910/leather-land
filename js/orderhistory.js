import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc,updateDoc  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js"; // Replace with your Firebase config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const email = localStorage.getItem("email");

// Fetch and render order history
async function fetchOrderHistory() {
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
      const cancelOrder = document.createElement("button");
      cancelOrder.classList.add("cancel-order");
      cancelOrder.innerHTML = "Cancel order";

      const btnContainer = document.createElement('div');
      btnContainer.classList.add("btn-contaner");
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

      cancelOrder.addEventListener("click", async (e) => {
        e.preventDefault();
        if(confirm('Are you want to cancel order')){
          await cancelOrderHandler(email, order.orderId);
        }
      });

      btnContainer.appendChild(cancelOrder);
      btnContainer.appendChild(trackBtn);
      orderItemsContainer.appendChild(itemLi);
      orderItemsContainer.appendChild(btnContainer);
    });

    orderList.appendChild(orderDiv);
  });
}

async function cancelOrderHandler(email, orderId) {
  const orderRef = doc(db, "orders", email);

  try {
    const orderSnapshot = await getDoc(orderRef);

    if (orderSnapshot.exists()) {
      const orders = orderSnapshot.data().orders;
      const updatedOrders = orders.filter(order => order.orderId !== orderId);

      await updateDoc(orderRef, { orders: updatedOrders });
      alert("Order cancelled successfully!");
      fetchOrderHistory(); // Refresh the order list
    } else {
      alert("Order not found.");
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    alert("Failed to cancel order. Please try again.");
  }
}

// Fetch order history on page load
fetchOrderHistory();
