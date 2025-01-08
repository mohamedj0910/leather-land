import { getUserDetailsByEmail } from "./users.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged,updateEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { firebaseConfig } from "./config.js";  // Adjust the path to your config file

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth();

let loader = document.querySelector('.loader-container');
let saveBtn = document.querySelector(".save");
let editBtn = document.querySelector(".edit");
let email = localStorage.getItem('email');
let firstName = document.getElementById('first-name');
let lastName = document.getElementById('last-name');
let address = document.getElementById('address');
let phone = document.getElementById('phone');
let emailVal = document.getElementById('email');
let heading = document.getElementById('heading');
let ProfileCont = document.querySelector('.profile-container');
let uid = localStorage.getItem('uid')


async function loadUserDetails() {
  loader.style.display = 'flex';
  ProfileCont.style.display = 'none';

  let uid = localStorage.getItem('uid');
  if (!uid) {
    alert("User not logged in");
    window.location.href = '/';
    return;
  }

  try {
    const userInfo = await getUserDetailsByEmail(uid);
    heading.textContent = `Hello, ${userInfo.firstName}`;
    firstName.value = userInfo.firstName;
    lastName.value = userInfo.lastName || '';
    address.value = userInfo.address?.address || '';
    phone.value = userInfo.phone;
    emailVal.value = email;
  } catch (error) {
    console.error("Error loading user details:", error);
    alert("Failed to load user details.");
  } finally {
    loader.style.display = 'none';
    ProfileCont.style.display = 'block';
  }
}

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Validate inputs before saving
  if (!validateProfileForm()) {
    return; // Stop if validation fails
  }

  const updatedFirstName = firstName.value;
  const updatedLastName = lastName.value;
  const updatedPhone = phone.value;
  const updatedAddress = address.value;
  const updatedEmail = emailVal.value;

  
  saveUserDetails(updatedFirstName, updatedLastName, updatedPhone,updatedEmail, updatedAddress);
  // Disable input fields after save
  const inputs = document.querySelectorAll("#profile-form input");
  inputs.forEach((input) => input.setAttribute("readonly", "readonly"));
  editBtn.style.display = "inline-block";
  saveBtn.style.display = "none";
  alert("Profile saved successfully!");
});

editBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Enable inputs for editing
  const inputs = document.querySelectorAll("#profile-form input");
  inputs.forEach((input) => input.removeAttribute("readonly"));
  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
});

// Save user details to Firestore
async function saveUserDetails(firstName, lastName, phone,email, address) {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email:email,
        address: { firstName, phone, address }
      });
      console.log('User details updated successfully!');
      localStorage.setItem("address", JSON.stringify({ firstName, phone, address }));
    } else {
      console.log('No user document found!');
    }
  } catch (error) {
    console.error('Error saving user details: ', error);
  }
}

// Validate the profile form
function validateProfileForm() {
  const firstNameValue = firstName.value.trim();
  const lastNameValue = lastName.value.trim();
  const phoneValue = phone.value.trim();
  const addressValue = address.value.trim();
  const emailValue = emailVal.value.trim();

  let isValid = true;

  // Clear previous error messages
  clearErrorMessages();

  // Validate first name (cannot contain spaces)
  if (/\s/.test(firstNameValue) || firstNameValue === "") {
    firstName.style.borderColor = "red";
    document.querySelector('.fname-error').textContent = "First name cannot contain spaces or be empty.";
    isValid = false;
  } else {
    firstName.style.borderColor = "green";
  }

  // Validate last name (optional but cannot contain spaces)
  if (lastNameValue !== "" && /\s/.test(lastNameValue)) {
    lastName.style.borderColor = "red";
    document.querySelector('.lname-error').textContent = "Last name cannot contain spaces.";
    isValid = false;
  } else {
    lastName.style.borderColor = "green";
  }

  // Validate phone number (must be exactly 10 digits)
  if (!/^\d{10}$/.test(phoneValue)) {
    phone.style.borderColor = "red";
    document.querySelector('.phone-error').textContent = "Phone number must be exactly 10 digits.";
    isValid = false;
  } else {
    phone.style.borderColor = "green";
  }

  // Validate address (cannot be empty)
  if (addressValue === "") {
    address.style.borderColor = "red";
    document.querySelector('.address-error').textContent = "Address cannot be empty.";
    isValid = false;
  } else {
    address.style.borderColor = "green";
  }

  // Validate email (basic check for empty value, more can be added for better email validation)
  if (emailValue === "") {
    emailVal.style.borderColor = "red";
    document.querySelector('.email-error').textContent = "Email cannot be empty.";
    isValid = false;
  } else {
    emailVal.style.borderColor = "green";
  }

  return isValid;
}

// Clear all error messages
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll('.fname-error, .lname-error, .address-error, .phone-error, .email-error');
  errorMessages.forEach((errorMessage) => {
    errorMessage.textContent = "";
  });
}

// Real-time validation for phone number and first name
function restrictInputCharacters() {
  firstName.addEventListener('input', (e) => {
    if (/\s/.test(e.target.value)) {
      firstName.value = firstName.value.replace(/\s+/g, '').trim();
      alert("Spaces are not allowed in the first name.");
    }
  });

  phone.addEventListener('input', (e) => {
    if (/\D/.test(e.target.value)) {
      phone.value = phone.value.replace(/\D/g, '').trim();
      alert("Only digits are allowed in the phone number.");
    }
    // Ensure phone number does not exceed 10 digits
    if (phone.value.length > 10) {
      phone.value = phone.value.substring(0, 10);
    }
  });
}

// Call the function to restrict unwanted characters
restrictInputCharacters();

// Load the user details when the page loads
loadUserDetails();