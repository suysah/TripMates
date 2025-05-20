// Import necessary modules
// import axios from 'axios';
// import { showAlert } from './alert'; // Assuming 'alert.js' exists in the same folder

// import axios from 'axios';

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert(); // Hide any existing alert before showing a new one
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup); // Insert new alert into the DOM
  window.setTimeout(hideAlert, 5000); // Remove the alert after 5 seconds
};

const login = async (email, password) => {
  // console.log(email, password);

  try {
    // Sending login request to the server
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login', // Your backend API endpoint
      data: { email, password },
    });

    // Handle successful login
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/'); // Redirect to the homepage after successful login
      }, 1000);
    }

    // console.log(res); // Log the response from the server (optional)
  } catch (error) {
    // console.log(error.response.data.message); // Log the error message
    showAlert('error', error.response.data.message); // Show error alert
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    showAlert('success', ' logout successful');
    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (error) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

// Get the form element and handle the form submission
const formInfo = document.querySelector('.form--login');

if (formInfo) {
  formInfo.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password); // Call login function with the form data
  });
}

// logout
const logoutBtn = document.querySelector('.nav__el--logout');

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
