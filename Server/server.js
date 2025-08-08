const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handle synchronous errors
process.on('uncaughtException', (err) => {
  // console.log('UNCAUGHT EXCEPTION, SHUTTING DOWN...');
  // console.log(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: './config.env' });

const app = require('./app');

// Replace <PASSWORD> in the MongoDB URI with the password from the environment
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => {
    ('Database connection successful');
  })
  .catch((err) => {
    console.log('Database connection failed');
    // console.log(err.message);
    process.exit(1); // Exit if DB connection fails
  });

// Start the server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  // console.log(`App running on port ${port}...`);
});

// Handle asynchronous errors
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION, SHUTTING DOWN');
  // console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
