// Initialize Firestore and Firebase Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { firebaseConfig } from "./config.js";  // Adjust the path to your config file

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

async function saveUserDetails(firstName, lastName, phone, email, userId) {
  try {
    const userDocRef = doc(db, 'users', userId);

    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log('User with this UID already exists.');
      return;
    }

    await setDoc(userDocRef, {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      uid: userId 
    });
    console.log('User details saved successfully!');
  } catch (error) {
    console.error('Error saving user details: ', error);
  }
}

// Function to retrieve user details from Firestore by email (using email as document ID)
async function getUserDetailsByEmail(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);  // Use email as the document ID
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { ...userDoc.data(), id: userDoc.id };
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
    getUserDetailsByEmail(user.uid)
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