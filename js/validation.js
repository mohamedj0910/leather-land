//error feilds
const fnameError = document.querySelector('.fname-error');
const lnameError = document.querySelector('.lname-error');
const emailError = document.querySelector('.email-error');
const phoneError = document.querySelector('.phone-error');
const emailErr = document.querySelector('.email-err');
const passErr = document.querySelector('.pass-err');

//input feilds
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

    // Get values from input fields


    // Clear previous error messages and reset the input field border color
    fnameError.textContent = '';
    lnameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';


    // A variable to track if the form is valid
    let valid = true;
    if (fname.value.trim() == "") {
      valid = false
      fname.style.borderColor = 'red';  // Highlight the field with a red border
      fnameError.textContent = 'First name cannot be empty';  // Show the error message
    }

    if (lname.value.trim() == "") {
      valid = false
      lname.style.borderColor = 'red';
      lnameError.textContent = 'Last name cannot be empty';
    }

    if (email.value.trim() == "") {
      email.style.borderColor = 'red';
      emailError.textContent = 'Email cannot be empty';
      valid = false
    }

    if (phone.value.trim() == "") {
      phone.style.borderColor = 'red';
      phoneError.textContent = 'Phone number cannot be empty';
      valid = false
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
    }
    else {
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
    }
    else {
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
    }
    else {
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
    }
    else {
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
      alert("Sapces are not allowed in password");
    }
    password.value = password.value.replace(/\s+/, '').trim();
  });
  newPassword.addEventListener('input', function (e) {
    if (e.target.value.includes(" ")) {
      alert("Sapces are not allowed in password");
    }
    newPassword.value = newPassword.value.replace(/\s+/, '').trim();
  });
  fname.addEventListener('input', function(e) {
    if (/\d/.test(e.target.value)) {  // Check if there are numbers in the first name
      alert("Numbers are not allowed in first name");
    }
    if (e.target.value.includes(" ")) {
      alert("Sapces are not allowed in first name");
    }
    fname.value = fname.value.replace(/\s+/, '').trim();
    fname.value = fname.value.replace(/\d/, '').trim();
  });
  lname.addEventListener('input', function(e) {
    if (/\d/.test(e.target.value)) {  // Check if there are numbers in the first name
      alert("Numbers are not allowed in last name");
    }
    if (e.target.value.includes(" ")) {
      alert("Sapces are not allowed in last name");
    }
    lname.value = lname.value.replace(/\s+/, '').trim();
    lname.value = lname.value.replace(/\d/, '').trim();
  });
}

function inputValidation() {
  fname.addEventListener('input', function (e) {
    e.preventDefault();
    if (fname.value.length < 3) {
      fnameError.textContent = 'Firstnamr should be atleast 3 characters';
    }
    else {
      fnameError.textContent = '';
    }
  })
  lname.addEventListener('input', function (e) {
    e.preventDefault();
    if (lname.value.length < 3) {
      lnameError.textContent = 'Last name should be atleast 3 characters';
    }
    else {
      lnameError.textContent = '';
    }
  })
  phone.addEventListener('input', function (e) {
    e.preventDefault();
    if (phone.value.length < 10) {
      phoneError.textContent = `You have to enter ${10 - phone.value.length} numbers`;
    }
    else {
      phoneError.textContent = '';
    }
  });
}
validateSignUpForm();
wrongCharacters();
inputValidation();
