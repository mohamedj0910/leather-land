import { getUserDetailsByEmail } from "./users.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, updateEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
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
let doorno = document.getElementById('doorno');
let street = document.getElementById('street');
let city = document.getElementById('city');
let pincode = document.getElementById('pincode');
let state = document.getElementById('state');
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
    doorno.value = userInfo.address?.doorno || '';
    street.value = userInfo.address?.street || '';
    city.value = userInfo.address?.city || '';
    pincode.value = userInfo.address?.pincode || '';
    state.value = userInfo.address?.state || '';
    phone.value = userInfo.phone;
    emailVal.value = userInfo.email;
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
  const updatedEmail = emailVal.value;

  const updatedAddress = {
    doorno: doorno.value,
    street: street.value,
    city: city.value,
    pincode: pincode.value,
    state: state.value
  };

  if(!updatedFirstName || !updatedAddress.doorno || !updatedAddress.city || !updatedAddress.pincode || !updatedPhone) {
    return;
  }

  saveUserDetails(updatedFirstName, updatedLastName, updatedPhone, updatedAddress);
  
  // Disable input fields after save
  const inputs = document.querySelectorAll("#profile-form input");
  inputs.forEach((input) => {
    input.setAttribute("readonly", "readonly");
    input.style.borderColor = '#ccc'
  });
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
  emailVal.setAttribute("readonly","readonly")
});

// Save user details to Firestore
async function saveUserDetails(firstName, lastName, phone, address) {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address
      });
      console.log('User details updated successfully!');
      localStorage.setItem("address", JSON.stringify(address)); 
    } else {
      console.log('No user document found!');
    }
    clearErrorMessages();
  } catch (error) {
    console.error('Error saving user details: ', error);
  }
}

// Validate the profile form
// Validate the profile form
function validateProfileForm() {
  const firstNameValue = firstName.value.trim();
  const lastNameValue = lastName.value.trim();
  const phoneValue = phone.value.trim();
  const doornoValue = doorno.value.trim();
  const streetValue = street.value.trim();
  const cityValue = city.value.trim();
  const pincodeValue = pincode.value.trim();
  const stateValue = state.value.trim();

  let isValid = true;

  // Clear previous error messages
  clearErrorMessages();

  // Validate phone number (must be exactly 10 digits)
  if (!/^\d{10}$/.test(phoneValue)) {
    phone.style.borderColor = "red";
    document.querySelector('.phone-error').textContent = "Phone number must be exactly 10 digits.";
    isValid = false;
  } else {
    phone.style.borderColor = "green";
  }


  if (!/^[A-Za-z0-9]{1,6}$/.test(doornoValue)) {
    doorno.style.borderColor = "red";
    document.querySelector('.doorno-error').textContent = "Door number must be exactly 6 characters long and can only contain alphabets and numbers.";
    isValid = false;
  } else {
    doorno.style.borderColor = "green";
  }
  

  // Validate street name (must contain alphabets or a combination of numbers and alphabets)
  if (!/^[a-zA-Z0-9\s]+$/.test(streetValue) || /^[0-9]+$/.test(streetValue)) {
    street.style.borderColor = "red";
    document.querySelector('.street-error').textContent = "Street name must contain letters and/or numbers, but not only numbers.";
    isValid = false;
  } else {
    street.style.borderColor = "green";
  }

  // Validate city (must only contain alphabets)
  if (!/^[a-zA-Z\s]+$/.test(cityValue)) {
    city.style.borderColor = "red";
    document.querySelector('.city-error').textContent = "City must only contain letters.";
    isValid = false;
  } else {
    city.style.borderColor = "green";
  }

  // Validate pincode (must be exactly 6 digits)
  if (!/^\d{6}$/.test(pincodeValue)) {
    pincode.style.borderColor = "red";
    document.querySelector('.pincode-error').textContent = "Pincode must be exactly 6 digits.";
    isValid = false;
  } else {
    pincode.style.borderColor = "green";
  }

  // Validate state (no specific validation mentioned, but it should not be empty)
  if (stateValue === "") {
    state.style.borderColor = "red";
    document.querySelector('.state-error').textContent = "State cannot be empty.";
    isValid = false;
  } else {
    state.style.borderColor = "green";
  }

  return isValid;
}

function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('form-group span');
    errorMessages.forEach((errorMessage) => {
      errorMessage.textContent = "";
    });
  }
  
  // Real-time validation for phone number and first name
  function restrictInputCharacters() {
    firstName.addEventListener('input', (e) => {
      if (/[^a-zA-Z]/.test(e.target.value)) {
        firstName.value = firstName.value.replace(/[^a-zA-Z]/g, '').trim();
      }
    });
  
    lastName.addEventListener('input', (e) => {
      if (/[^a-zA-Z]/.test(e.target.value)) {
        lastName.value = lastName.value.replace(/[^a-zA-Z]/g, '').trim();
      }
    });
  
    doorno.addEventListener('input', (e) => {
      // Only allow numbers, letters, and slashes, with a max length of 8
      if (/[^a-zA-Z0-9/]/.test(e.target.value)) {
        doorno.value = doorno.value.replace(/[^a-zA-Z0-9/]/g, '').trim();
      }
      if (doorno.value.length > 8) {
        doorno.value = doorno.value.substring(0, 6);
      }
    });
  
    street.addEventListener('input', (e) => {
      // Allow anything for street (optional, can restrict if needed)
    });
  
    city.addEventListener('input', (e) => {
      if (/[^a-zA-Z]/.test(e.target.value)) {
        city.value = city.value.replace(/[^a-zA-Z]/g, '').trim();
      }
    });
  
    pincode.addEventListener('input', (e) => {
      // Only allow 6-digit number for pincode
      if (/[^0-9]/.test(e.target.value)) {
        pincode.value = pincode.value.replace(/[^0-9]/g, '').trim();
      }
      if (pincode.value.length > 6) {
        pincode.value = pincode.value.substring(0, 6);
      }
    });
  
    state.addEventListener('input', (e) => {
      if (/[^a-zA-Z]/.test(e.target.value)) {
        state.value = state.value.replace(/[^a-zA-Z]/g, '').trim();
      }
    });
  
    phone.addEventListener('input', (e) => {
      if (/\D/.test(e.target.value)) {
        phone.value = phone.value.replace(/\D/g, '').trim();
      }
      if (phone.value.length > 10) {
        phone.value = phone.value.substring(0, 10);
      }
    });
}

  
  // Call the function to restrict unwanted characters
  restrictInputCharacters();

// Call the function to load the user details when the page loads
loadUserDetails();