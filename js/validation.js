const fnameError = document.querySelector('.fname-error');
const lnameError = document.querySelector('.lname-error');
const emailError = document.querySelector('.email-error');
const phoneError = document.querySelector('.phone-error');
const passwordError = document.querySelector('.password-error');

function validateForm(){
  // Get a reference to the sign-up form
  let signUpForm = document.getElementById('sign-up-form');
  
  // Add an event listener to the form submit event
  signUpForm.addEventListener('submit', function(e) {
    // Prevent the form from submitting immediately
    e.preventDefault();

    // Get values from input fields
    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const email = document.getElementById('new-username');
    const phone = document.getElementById('Phone');
    const password = document.getElementById('new-password');
    
    // Clear previous error messages and reset the input field border color
    fnameError.textContent = '';
    lnameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    passwordError.textContent = '';
    
    // A variable to track if the form is valid
    let valid = true;
    
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
    }

    // Validate Password
    if (!password.checkValidity()) {
      valid = false;
      if (password.validity.valueMissing) {
        password.style.borderColor = 'red';
        passwordError.textContent = 'Password cannot be empty';
      } else if (password.validity.tooShort) {
        password.style.borderColor = 'red';
        passwordError.textContent = 'Password must be at least 8 characters';  // Password too short
      }
    }

    // If all fields are valid, submit the form
    if (valid) {
      return true;
    }
  });
}
validateForm();