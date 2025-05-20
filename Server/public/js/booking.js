const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const bookTour = async (tourId, formData) => {
  try {
    const tourResponse = await axios({
      method: 'GET',
      url: `/api/v1/tours/${tourId}`,
    });

    const tour = tourResponse.data.data;

    if (!tour) {
      showAlert('error', 'This tour does not exist!');
      return;
    }

    const randomTenDigitNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    );

    const sessionResponse = await axios({
      method: 'POST',
      url: `/api/v1/payments/get-payment`,
      data: {
        card_no: formData.get('card-number'),
        cvv: formData.get('cvv'),
        payment_id: randomTenDigitNumber,
        tour_name: tour.data.name,
        tour_price: tour.data.price,
      },
    });

    if (sessionResponse.data.status !== 'success') {
      showAlert('error', 'Payment failed. Please try again.');
    }

    const booking = await axios({
      method: 'POST',
      url: `/api/v1/bookings/`,
      data: {
        tour: tourId,
        price: tour.data.price,
      },
    });

    if (booking.data.status === 'success') {
      showAlert(
        'success',
        'Booking successful! You can check it in the My Bookings section.'
      );
      window.setTimeout(() => {
        location.assign('/me');
      }, 3000);
    }
  } catch (err) {
    // console.log(err);

    showAlert('error', 'Payment failed. Please try again.');
  }
};

const form = document.querySelector('.form--payment');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const tourId = form.querySelector('#booking-payment').dataset.tourId; // Extract the tour ID
    await bookTour(tourId, formData);
  });
}
