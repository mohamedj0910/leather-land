//error fields
const fnameError = document.querySelector('.fname-error');
const lnameError = document.querySelector('.lname-error');
const emailError = document.querySelector('.email-error');
const phoneError = document.querySelector('.phone-error');
const emailErr = document.querySelector('.email-err');
const passErr = document.querySelector('.pass-err');
const sBtn = document.getElementById('signUpButton');

//input fields
const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const email = document.getElementById('new-username');
const phone = document.getElementById('phone');

function validateSignUpForm() {
  // Get a reference to the sign-up form
  let signUpForm = document.getElementById('sign-up-form');

  // Add an event listener to the form submit event
  signUpForm.addEventListener('submit', function (e) {
    // Prevent the form from submitting immediately
    e.preventDefault();

    // Clear previous error messages and reset the input field border color
    fnameError.textContent = '';
    lnameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';

    // A variable to track if the form is valid
    let valid = true;
    if (fname.value.trim() == "") {
      valid = false;
      fname.style.borderColor = 'red';  // Highlight the field with a red border
      fnameError.textContent = 'First name cannot be empty';  // Show the error message
    }

    if (lname.value.trim() == "") {
      valid = false;
      lname.style.borderColor = 'red';
      lnameError.textContent = 'Last name cannot be empty';
    }

    if (email.value.trim() == "") {
      email.style.borderColor = 'red';
      emailError.textContent = 'Email cannot be empty';
      valid = false;
    }

    if (phone.value.trim() == "") {
      phone.style.borderColor = 'red';
      phoneError.textContent = 'Phone number cannot be empty';
      valid = false;
    }

    // Validate First Name
    if (!fname.checkValidity()) {
      valid = false;  // Mark the form as invalid if there is an issue
      if (fname.validity.valueMissing) {
        fname.style.borderColor = 'red';  // Highlight the field with a red border
        fnameError.textContent = 'First name cannot be empty';  // Show the error message
      } else if (fname.validity.tooShort) {
        fname.style.borderColor = 'red';
        fnameError.textContent = 'First name must be at least 2 characters';  // Show the error message for short input
      }
    } else {
      fname.style.borderColor = 'green';  // Highlight the field with a green border
      fnameError.textContent = '';  // Show the error message
    }

    // Validate Last Name
    if (!lname.checkValidity()) {
      valid = false;
      if (lname.validity.valueMissing) {
        lname.style.borderColor = 'red';
        lnameError.textContent = 'Last name cannot be empty';
      } else if (lname.validity.tooShort) {
        lname.style.borderColor = 'red';
        lnameError.textContent = 'Last name must be at least 2 characters';
      }
    } else {
      lname.style.borderColor = 'green';  // Highlight the field with a green border
      lnameError.textContent = '';  // Show the error message
    }

    // Validate Email Address
    if (!email.checkValidity()) {
      valid = false;
      if (email.validity.valueMissing) {
        email.style.borderColor = 'red';
        emailError.textContent = 'Email cannot be empty';
      } else if (email.validity.typeMismatch) {
        email.style.borderColor = 'red';
        emailError.textContent = 'Please enter a valid email address';  // Invalid email format
      }
    } else {
      email.style.borderColor = 'green';  // Highlight the field with a green border
      emailError.textContent = '';  // Show the error message
    }

    // Validate Phone Number
    if (!phone.checkValidity()) {
      valid = false;
      if (phone.validity.valueMissing) {
        phone.style.borderColor = 'red';
        phoneError.textContent = 'Phone number cannot be empty';
      } else if (phone.validity.patternMismatch) {
        phone.style.borderColor = 'red';
        phoneError.textContent = 'Please enter a valid phone number';  // Invalid phone number format
      }
    } else {
      phone.style.borderColor = 'green';  // Highlight the field with a green border
      phoneError.textContent = '';  // Show the error message
    }

    // If all fields are valid, submit the form
    if (valid) {
      return true;
    }
  });
}

function wrongCharacters() {
  const newPassword = document.getElementById('new-password');
  const password = document.getElementById('password');
  password.addEventListener('input', function (e) {
    if (e.target.value.includes(" ")) {
      alert("Spaces are not allowed in password");
    }
    password.value = password.value.replace(/\s+/, '').trim();
  });
  newPassword.addEventListener('input', function (e) {
    if (e.target.value.includes(" ")) {
      alert("Spaces are not allowed in password");
    }
    newPassword.value = newPassword.value.replace(/\s+/, '').trim();
  });
  fname.addEventListener('input', function (e) {
    if (/[^a-zA-Z]/.test(e.target.value)) {
      alert("Only alphabets are allowed in the first name");
    }
    fname.value = fname.value.replace(/[^a-zA-Z]/g, '').trim();
  });
  lname.addEventListener('input', function (e) {
    // Check if there are any non-alphabetic characters (not A-Z or a-z)
    if (/[^a-zA-Z]/.test(e.target.value)) {
      alert("Only alphabets are allowed in the last name");
    }
    lname.value = lname.value.replace(/[^a-zA-Z]/g, '').trim();
  });
}

function inputValidation() {
  // Check the first name input
  fname.addEventListener('input', function (e) {
    e.preventDefault();

    if (fname.value.length < 3) {
      sBtn.style.pointerEvents = 'none';  // Disable click
      sBtn.style.opacity = '0.5'; 
      fnameError.textContent = 'First name should be at least 3 characters';
      fname.style.borderColor = 'crimson';
    } else {
      sBtn.style.pointerEvents = 'auto';  // Allow click
      sBtn.style.opacity = '1'; 
      fnameError.textContent = '';
      fname.style.borderColor = 'green';
    }
    // toggleSubmitButton(); // Check the button state after each input
  });

  // Check the last name input
  lname.addEventListener('input', function (e) {
    e.preventDefault();

    if (lname.value.length < 3) {
      sBtn.style.pointerEvents = 'none';  // Disable click
      sBtn.style.opacity = '0.5'; 
      lnameError.textContent = 'Last name should be at least 3 characters';
      lname.style.borderColor = 'crimson';
    } else {
      sBtn.style.pointerEvents = 'auto';  // Allow click
      sBtn.style.opacity = '1'; 
      lnameError.textContent = '';
      lname.style.borderColor = 'green';
    }
    // toggleSubmitButton(); // Check the button state after each input
  });

  // Check the phone input
  phone.addEventListener('input', function (e) {
    e.preventDefault();

    if (phone.value.length < 10) {
      sBtn.style.pointerEvents = 'none';  // Disable click
      sBtn.style.opacity = '0.5'; 
      phoneError.textContent = `You have to enter ${10 - phone.value.length} numbers`;
      phone.style.borderColor = 'crimson';
    } else {
      sBtn.style.pointerEvents = 'auto';  // Allow click
      sBtn.style.opacity = '1'; 
      phoneError.textContent = '';
      phone.style.borderColor = 'green';
    }
    // toggleSubmitButton(); // Check the button state after each input
  });
}

// Function to check if any input is invalid and disable/enable the submit button
// function toggleSubmitButton() {
//   // Check if any input field is invalid
//   const isValid = fname.value.length >= 3 && lname.value.length >= 3 && phone.value.length >= 10;
  
//   // Disable or enable the submit button based on the validity of the inputs
//   if (isValid) {
//     sBtn.style.pointerEvents = 'auto';  // Allow click
//     sBtn.style.opacity = '1';  // Full opacity (enabled)
//   } else {
//     sBtn.style.pointerEvents = 'none';  // Disable click
//     sBtn.style.opacity = '0.5';  // Reduced opacity (disabled)
//   }
// }

// Prevent anchor default behavior if it's disabled
// sBtn.addEventListener('click', function (e) {
//   if (sBtn.style.pointerEvents === 'none') {
//     e.preventDefault();
//   }
// });

validateSignUpForm();
wrongCharacters();
inputValidation();
