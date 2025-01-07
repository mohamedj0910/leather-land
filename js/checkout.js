import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid@3.1.25/nanoid.min.js';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const orderItemsContainer = document.getElementById("order-items");
const subtotalElem = document.getElementById("subtotal");
const totalElem = document.getElementById("total");
const addressForm = document.getElementById("address-form");
const editButton = document.getElementById("edit-address");
const saveButton = document.getElementById('save-btn');
const cashPayBtn = document.querySelector('.summary > button');
const cashBtn = document.getElementById('cash');
const cardBtn = document.getElementById('card');
const paymentForm = document.getElementById('payment-form');
const cardPayBtn = paymentForm.querySelector('button');
const phone = document.getElementById("phone");
const tick = document.querySelector('video');
const successModal = document.querySelector('.modal');
const successSound = document.querySelector('audio');

phone.addEventListener('input', function (e) {
  e.preventDefault();
  const phoneError = document.querySelector('.phone-error')
  if (phone.value.length < 10) {
    saveButton.disabled = true;
    saveButton.style.opacity = '0.7'
    phoneError.textContent = `You have to enter ${10 - phone.value.length} numbers`;
    phoneError.style.color = 'crimson'
    phone.style.borderColor = 'crimson';
  }
  else if (phone.value.length > 10) {
    phone.value = phone.value.substring(0, 10)
  }
   else {
    saveButton.disabled = false;
    saveButton.style.opacity = '1'
    phoneError.textContent = '';
    phone.style.borderColor = '#ddd';
  }
});


const cardNumberInput = document.getElementById("card-number");
const expiryDateInput = document.getElementById("expiry-date");
const cvvInput = document.getElementById("cvv");
const cardholderNameInput = document.getElementById("cardholder-name");
const messageElement = document.getElementById("form-message");
const cardholderNameError = document.getElementById("cardholder-name-error");
const cardNumberError = document.getElementById("card-number-error");
const expiryDateError = document.getElementById("expiry-date-error");
const cvvError = document.getElementById("cvv-error");
const deliveryMode = document.querySelector('.del-mode');



cardNumberInput.addEventListener("input", function (event) {
  let inputValue = event.target.value.replace(/\D/g, "");
  let formattedValue = inputValue.replace(/(\d{4})(?=\d)/g, "$1 ");
  event.target.value = formattedValue;
});

expiryDateInput.addEventListener("input", function (event) {
  let inputValue = event.target.value.replace(/\D/g, "");
  if (inputValue.length <= 2) {
    if (inputValue.length === 1 && inputValue > "2") {
      inputValue = "0" + inputValue;
    }
    event.target.value = inputValue;
  } else if (inputValue.length > 2 && inputValue.length <= 4) {
    inputValue = inputValue.slice(0, 2) + "/" + inputValue.slice(2, 4);
    event.target.value = inputValue;
  }

  if (inputValue.length > 5) {
    event.target.value = inputValue.slice(0, 5);
  }

  if (inputValue.length === 5 && parseInt(inputValue.slice(0, 2)) > 12) {
    event.target.value = "12/" + inputValue.slice(3, 5);
  }

  if (inputValue.length === 5) {
    setTimeout(() => {
      cvvInput.focus();
    }, 100);
  }
});

cvvInput.addEventListener("input", function (event) {
  let inputValue = event.target.value.replace(/\D/g, "");
  event.target.value = inputValue.slice(0, 3);
});

cardholderNameInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  let validInput = inputValue.replace(/[^a-zA-Z\s]/g, "");
  event.target.value = validInput;
});

function validateForm() {
  let errorMessage = false;
  const cardholderName = cardholderNameInput.value;
  const cardNumber = cardNumberInput.value.replace(/\s/g, "");
  const expiryDate = expiryDateInput.value;
  const cvv = cvvInput.value;
  if (!cardholderName || cardholderName.length < 3) {
    cardholderNameError.textContent =
      "Cardholder name must be at least 3 characters long.";
    cardholderNameError.style.visibility = "visible";
    errorMessage = true;
  } else if (/[^a-zA-Z\s]/.test(cardholderName)) {
    cardholderNameError.textContent =
      "Cardholder name can only contain letters and spaces.";
    cardholderNameError.style.visibility = "visible";
    errorMessage = true;
  } else {
    cardholderNameError.style.visibility = "hidden";
  }

  const cardNumberRegex = /^\d{16}$/;
  if (!cardNumber.match(cardNumberRegex)) {
    cardNumberError.textContent = "Card number must be 16 digits.";
    cardNumberError.style.visibility = "visible";
    errorMessage = true;
  } else {
    cardNumberError.style.visibility = "hidden";
  }

  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryDate.match(expiryRegex)) {
    expiryDateError.textContent = "Expiry date must be in MM/YY format.";
    expiryDateError.style.visibility = "visible";
    errorMessage = true;
  } else {
    const [month, year] = expiryDate.split("/");
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;
    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      expiryDateError.textContent = "Expiry date cannot be in the past.";
      expiryDateError.style.visibility = "visible";
      errorMessage = true;
    } else {
      expiryDateError.style.visibility = "hidden";
    }
  }

  const cvvRegex = /^\d{3}$/;
  if (!cvv.match(cvvRegex)) {
    cvvError.textContent = "CVV must be 3 digits.";
    cvvError.style.visibility = "visible";
    errorMessage = true;
  } else {
    cvvError.style.visibility = "hidden";
  }

  if (errorMessage) {
    messageElement.textContent = "Please correct the errors and try again.";
    messageElement.classList.add("error");
    messageElement.classList.remove("success");
  } else {
    messageElement.textContent = "Payment processed successfully!";
    messageElement.classList.add("success");
    messageElement.classList.remove("error");
  }
  return errorMessage;
}

if (!cardBtn.checked || !cashBtn.checked) {
  cashPayBtn.disabled = true;
}

cardBtn.addEventListener('input', () => {
  deliveryMode.textContent = ''
  if (cardBtn.checked) {
    deliveryMode.classList.remove('not');
    deliveryMode.textContent = 'Cash on Delivery';
    cashPayBtn.removeAttribute('id');
    paymentForm.style.display = 'block'
    cardPayBtn.setAttribute('id', 'proceed-to-payment');
    cashPayBtn.style.display = 'none'
  } else {
    cardPayBtn.removeAttribute('id');
    paymentForm.style.display = 'none';
  }
});


cashBtn.addEventListener('input', () => {
  deliveryMode.textContent = ''
  if (cashBtn.checked) {
    deliveryMode.classList.remove('not');
    deliveryMode.textContent = 'Card'
    cardPayBtn.removeAttribute('id');
    cashPayBtn.setAttribute('id', 'proceed-to-payment');
    cashPayBtn.style.display = 'block';
    cashPayBtn.disabled = false;
    paymentForm.style.display = 'none';
    cashPayBtn.addEventListener('click', confirmOrder)
  }
});

paymentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!validateForm()) {
    cardPayBtn.addEventListener('click', confirmOrder())
  }
});

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
console.log(productId)
// Fetch product details

async function fetchProductDetails() {

  if (!productId) {
    window.location.href = '/'
    return
  }

  try {
    const productRef = doc(db, "leatherProducts", productId);
    const productSnapshot = await getDoc(productRef);

    if (productSnapshot.exists()) {
      const product = productSnapshot.data();
      const basePrice = product.price;

      // Render order summary
      orderItemsContainer.innerHTML = `
        <tr>
          <td id="product-name">
            <img src="${product.image[0]}" alt="${product.product_name}" id="product-image" style="width: 50px;"> 
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
    const basePrice = parseInt(
      e.target.closest("tr").querySelector(".base-price").innerText,
      10
    );
    let quantity = parseInt(quantityInput.value, 10);

    // Adjust quantity based on the action
    if (action === "increase" && quantity < 9) quantity++;
    else if (action === "decrease" && quantity > 1) quantity--;

    quantityInput.value = quantity;
    updateTotals(basePrice, quantity);
  }
});

// Pre-fill the form with existing address if available
async function loadAddress() {
  let uid = localStorage.getItem("uid");
  if (!uid) return;

  try {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const address = userData.address || null; // Default to null if no address is present

      if (address) {
        // Prefill the form with the existing address
        let addressData = { 'fullName': address.fullName, 'phone': address.phone, 'address': address.address }
        console.log(addressData);
        localStorage.setItem('address', JSON.stringify(addressData));
        document.getElementById("full-name").value = address.fullName || "";
        document.getElementById("phone").value = address.phone || "";
        document.getElementById("address").value = address.address || "";

        // Enable read-only mode and show the Edit button
        setReadOnlyMode(true);
        editButton.style.display = "block";
      } else {
        // Hide the Edit button if no address exists
        editButton.style.display = "none";
      }
    }
  } catch (error) {
    console.error("Error loading address:", error);
  }
}

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

  let uid = localStorage.getItem("uid");
  if (!uid) {
    alert("User not logged in.");
    return;
  }

  try {
    const userRef = doc(db, "users", uid);

    // Save the address as a single object in Firestore
    await updateDoc(userRef, {
      address: { fullName, phone, address }
    });

    // Save the address in localStorage as well
    localStorage.setItem("address", JSON.stringify({ fullName, phone, address }));

    alert("Address updated successfully!");
    setReadOnlyMode(true);
    editButton.style.display = "block";
  } catch (error) {
    console.error("Error updating address:", error);
    alert("Failed to update address.");
  }
}
// Set fields to read-only mode
function setReadOnlyMode(isReadOnly) {
  const fullNameInput = document.getElementById("full-name");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const saveButton = addressForm.querySelector("button[type='submit']");
  editButton.disabled = false;
  editButton.style.opacity = '1'

  fullNameInput.readOnly = isReadOnly;
  phoneInput.readOnly = isReadOnly;
  addressInput.readOnly = isReadOnly;
  saveButton.disabled = isReadOnly;
}

// Enable editing mode
function enableEditing() {
  setReadOnlyMode(false);
  editButton.disabled = true;
  editButton.style.opacity = '0.6'
}

// Add event listener to the edit button
editButton.addEventListener("click", enableEditing);

// Load existing address on page load
loadAddress();

// Event listeners
addressForm.addEventListener("submit", saveAddress);
fetchProductDetails();

// Confirm order
// const confirmOrderButton = document.getElementById("proceed-to-payment");
// confirmOrderButton.addEventListener("click", confirmOrder);


async function confirmOrder() {
  const uid = localStorage.getItem("uid");
  if (!uid) {
    alert("Please log in to confirm your order.");
    return;
  }

  // Check if address fields are empty
  const address = JSON.parse(localStorage.getItem("address"));
  if (!address || !address.fullName || !address.phone || !address.address) {
    alert("Please fill in your address before confirming the order.");
    return;
  }

  if (!productId) {
    alert("Product ID is missing.");
    return;
  }

  try {
    const orderRef = doc(db, "orders", uid);
    const orderSnapshot = await getDoc(orderRef);

    // Generate a unique ID for the order
    const orderId = nanoid();

    // Extract product details from the DOM
    const productName = document.getElementById("product-name").textContent;
    const productPrice = parseInt(document.querySelector(".base-price").textContent.replace('₹', '').trim(), 10);
    const productQuantity = parseInt(document.querySelector(".quantity-input").value, 10);
    const productImage = document.getElementById("product-image").src;
    const totalPrice = parseInt(document.querySelector(".total-price").textContent.replace('₹', '').trim(), 10);

    // Create a new order object with the product details
    const newOrder = {
      orderId, // Unique ID for this order
      items: [
        {
          productId, // Use the product ID from the URL
          productName,
          quantity: productQuantity,
          price: productPrice,
          totalPrice,
          image: productImage,
        },
      ],
      orderDate: new Date().toISOString(),
      status: "Pending",
    };

    if (orderSnapshot.exists()) {
      // If orders already exist, add the new order to the array
      const existingOrders = orderSnapshot.data().orders || [];
      existingOrders.push(newOrder);

      // Update the user's order document with the new order
      await updateDoc(orderRef, {
        orders: existingOrders,
      });
    } else {
      // If no previous orders, create a new order document
      await setDoc(orderRef, {
        orders: [newOrder],
      });
    }

    successModal.style.display = 'block';
    successSound.play()
    tick.play();
    setTimeout(()=>{
      tick.pause()
    },3000)
    const goHomeBtn = successModal.querySelector('.go-home');
    const trakOrder =  successModal.querySelector('.track-order');
    trakOrder.addEventListener('click',(e)=>{
      e.preventDefault()
      window.location.href = `../pages/order-status.html?orderId=${orderId}`;
    });

    goHomeBtn.addEventListener('click',(e)=>{
      e.preventDefault();
      window.location.href = '/'
    })

  } catch (error) {
    console.error("Error confirming order:", error);
    alert("Error confirming order. Please try again.");
  }
}

// Attach this function to the "Confirm Order" button
// document.getElementById("proceed-to-payment").addEventListener("click", confirmOrder);

// Auto-update status after 7 days
async function autoUpdateOrderStatus(uid) {
  try {
    const orderRef = doc(db, "orders", uid);
    const orderSnapshot = await getDoc(orderRef);

    if (orderSnapshot.exists()) {
      const orderData = orderSnapshot.data().orders; // Assuming "orders" is an array
      const currentDate = new Date();

      for (let i = 0; i < orderData.length; i++) {
        const order = orderData[i];
        const orderDate = new Date(order.orderDate);

        const timeDiff = currentDate - orderDate;

        // Check if 7 days have passed (7 days * 24 hours * 60 minutes * 60 seconds * 1000 ms)
        if (timeDiff >= 7 * 24 * 60 * 60 * 1000 && order.status === "Pending") {
          // Update the order status to 'Completed'
          orderData[i].status = "Completed";
        }
      }

      // Update the Firestore document with the modified orders array
      await updateDoc(orderRef, {
        orders: orderData,
      });

      console.log("Order statuses updated to 'Completed'");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
}

// Call the function to update the order status
autoUpdateOrderStatus(localStorage.getItem("uid"));
