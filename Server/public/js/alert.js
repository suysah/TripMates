// alert.js
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
  hideAlert(); // Hide any existing alert before showing a new one
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentElement('afterbegin', markup); // Insert new alert into the DOM
  window.setTimeout(hideAlert, 5000); // Remove the alert after 5 seconds
};
