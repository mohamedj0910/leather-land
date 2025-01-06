import { getUserDetailsByEmail } from "./users.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
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
let ProfileCont = document.querySelector('.profile-container')

async function loadUserDeatils() {
  loader.style.display = 'flex';
  ProfileCont.style.display = 'none'
  let uid = localStorage.getItem('uid')

  if (!uid) {
    alert("User not logged in")
    window.location.href = '/'
  }
  const userInfo = await getUserDetailsByEmail(uid)

  heading.textContent = `Hello...${userInfo.firstName}`;
  firstName.value = userInfo.firstName;
  lastName.value = userInfo.lastName;
  address.value = userInfo.address?.address || '';
  phone.value = userInfo.phone;
  emailVal.value = email;
  loader.style.display = 'none';
  ProfileCont.style.display = 'block'
}

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const updatedFirstName = firstName.value;
  const updatedLastName = lastName.value;
  const updatedPhone = phone.value;
  const updatedAddress = address.value;

  saveUserDetails(updatedFirstName, updatedLastName, updatedPhone, updatedAddress);
  const inputs = document.querySelectorAll("#profile-form input");
  inputs.forEach((input) => input.setAttribute("readonly", "readonly"));
  editBtn.style.display = "inline-block";
  saveBtn.style.display = "none";
  alert("Profile saved successfully!");
});

editBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll("#profile-form input");
  inputs.forEach((input) => input.removeAttribute("readonly"));
  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
});



async function saveUserDetails(firstName, lastName, phone, address) {
  try {
    const userDocRef = doc(db, 'users', email);
    console.log(email);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: { address: address }
      });
      console.log('User details saved successfully!');
    } else {
      console.log('No user document found!');
    }
  } catch (error) {
    console.error('Error saving user details: ', error);
  }
}


loadUserDeatils();