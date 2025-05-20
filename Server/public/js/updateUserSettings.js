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

const userData = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// Type is either 'password' or 'data'
const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH', // Corrected HTTP method
      url,
      data,
    });

    // console.log(res);

    if (res.data.status === 'success') {
      // Check for response success
      showAlert('success', ` ${type.toUpperCase()} updated successfully`);
    }
  } catch (error) {
    showAlert('error', error.message);
  }
};

if (userData) {
  userData.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('photo', document.querySelector('#photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const currentPassword = document.querySelector('#password-current').value;
    const newPassword = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    await updateSettings(
      { currentPassword, newPassword, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'save password';
    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
  });
}
