const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '../../config.env' });

// Load models
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connection successful for sync');
    syncData();
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

const syncData = async () => {
  try {
    const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
    
    console.log('Clearing existing tours...');
    await Tour.deleteMany({});
    console.log('Existing tours cleared!');

    console.log(`Importing ${tours.length} tours...`);
    await Tour.create(tours, { validateBeforeSave: false });
    console.log('Tours imported successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
};
