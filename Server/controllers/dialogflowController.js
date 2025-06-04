const Tour = require('../models/tourModel');

// Tools intent
exports.handleAvailableTours = async (parameters, sessionId) => {
  try {
    const tours = await Tour.find({}, 'name');
    if (!tours || tours.length === 0) {
      return {
        fulfillmentText: `Currently, there are no tours available.`,
      };
    }

    const tourNames = tours.map((tour) => `• ${tour.name}`).join('\n');
    return {
      fulfillmentText: `Here are the tours we currently offer:\n\n${tourNames}`,
    };
  } catch (err) {
    console.error('Error fetching tours:', err);
    return {
      fulfillmentText: `Sorry, I couldn't fetch the tours right now. Please try again later.`,
    };
  }
};

// Ratings intent
exports.handleRatings = async (parameters, sessionId) => {
  const tourName = parameters['tour_name'];
  const tour = await Tour.findOne(
    { name: new RegExp(tourName, 'i') },
    'name ratingsAverage ratingsQuantity'
  );
  const responseText = `📌 ${tour.name}: ⭐ ${tour.ratingsAverage} from ${tour.ratingsQuantity} reviews`;
  return { fulfillmentText: responseText };
};

// Tour Details intent
exports.handleTourDetails = async (parameters, sessionId) => {
  const tourName = parameters['tour_name'];
  const tour = await Tour.findOne({ name: new RegExp(tourName, 'i') });

  if (!tour) {
    return {
      fulfillmentText: `Sorry, I couldn't find a tour named "${tourName}".`,
    };
  }

  return {
    fulfillmentText: `📍 *${tour.name}*\n\n${tour.summary}\n\nDuration: ${tour.duration} days\nDifficulty: ${tour.difficulty}\nPrice: $${tour.price}`,
  };
};

// Tour Price intent
exports.handleTourPrice = async (parameters, sessionId) => {
  const tourName = parameters['tour_name'];
  const tour = await Tour.findOne({ name: new RegExp(tourName, 'i') });

  if (!tour) {
    return { fulfillmentText: `I couldn't find the price for "${tourName}".` };
  }

  return {
    fulfillmentText: `💲 The price for *${tour.name}* is $${tour.price} per person.`,
  };
};

// Main webhook handler
exports.dialogflowWebhook = async (req, res) => {
  try {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;
    const sessionId = req.body.session;

    let response;

    switch (intentName) {
      case 'AvailableTours':
        response = await exports.handleAvailableTours(parameters, sessionId);
        break;

      case 'Ratings':
        response = await exports.handleRatings(parameters, sessionId);
        break;

      case 'TourDetails':
        response = await exports.handleTourDetails(parameters, sessionId);
        break;

      case 'TourPrice':
        response = await exports.handleTourPrice(parameters, sessionId);
        break;

      default:
        response = { fulfillmentText: "I'm not sure how to help with that." };
    }

    res.json(response);
  } catch (err) {
    console.error('Webhook error:', err);
    res.json({
      fulfillmentText: 'Something went wrong. Please try again later.',
    });
  }
};
