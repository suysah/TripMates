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

const signup = async (name, email, role, password, passwordConfirm) => {
  // console.log(email, password);

  try {
    // Sending login request to the server
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup', // Your backend API endpoint
      data: { name, email, role, password, passwordConfirm },
    });

    // Handle successful login
    if (res.data.status === 'success') {
      showAlert('success', 'sign-up successfully');
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

// Get the form element and handle the form submission
const formInfo = document.querySelector('.form--signup');

if (formInfo) {
  formInfo.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value.toLowerCase();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, role, password, passwordConfirm); // Call login function with the form data
  });
}
