// Initialize Firestore and Firebase Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { firebaseConfig } from "./config.js";  // Adjust the path to your config file

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth();

// Function to save user details to Firestore (called after sign-up)
async function saveUserDetails(firstName, lastName, phone, email) {
  try {
    const usersRef = collection(db, 'users');
    // Check if a user with the same email already exists
    const q = query(collection(db, 'users'), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('User with this email already exists.');
      return;
    }

    // Save the user details
    await addDoc(usersRef, {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
    });

    console.log('User details saved successfully!');
  } catch (error) {
    console.error('Error saving user details: ', error);
  }
}

// Function to retrieve user details from Firestore by email
async function getUserDetailsByEmail(email) {
  try {
    const q = query(collection(db, 'users'), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;  // Get the document ID

      // Return both user data and the ID
      return { ...userData, id: userId };  
    } else {
      console.log('No user found with the provided email.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user details: ', error);
  }
}

// Listen for authentication state change to fetch user data after login
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If the user is logged in, fetch their details from Firestore
    getUserDetailsByEmail(user.email)
      .then((userDetails) => {
        if (userDetails) {
          console.log('User details fetched: ', userDetails);
        }
      })
      .catch((error) => console.log('Error fetching user details:', error));
  } else {
    console.log('No user is signed in.');
  }
});

export { saveUserDetails, getUserDetailsByEmail };
