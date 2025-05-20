const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config.env' });
const fs = require('fs');

const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(
    'mongodb+srv://suyashnagar81:W8Rj9FW6F3iTxepb@cluster0.4yur8.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    console.log('Connection successfull');
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    // await Tour.create(tours, { validateBeforeSave: false });
    // await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('data imported');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    // await Tour.deleteMany({});
    // await User.deleteMany({});
    await Review.deleteMany({});
    console.log('data deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}

console.log(process.argv);
