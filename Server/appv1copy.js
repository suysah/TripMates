// const fs = require('fs');
// const express = require('express');
// const morgan = require('morgan');

// const app = express();

// //used to take info about request (GET /api/v1/tours 200 10.177 ms - 8685)
// app.use(morgan('dev'));

// //middleware (for post opetration we use middleware to get access to req.body )
// // use to modify the incomming data
// // expreess.json is also called body parser
// app.use(express.json());

// //our awn middle ware

// app.use((req, res, next) => {
//   next();
// });

// app.use((req, res, next) => {
//   req.requestedAt = new Date().toISOString();
//   next();
// });

// // app.get('/', (req, res) => {
// //   //   res.status(200).send('Hello from the server side');
// //   res.status(200).json({ message: 'Hello from the server side', name: 'siya' });
// // });

// // app.post('/', (req, res) => {
// //   res.send('you can post to thsi endpoint');
// // });

// //convert json to obj
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
// );

// const getAllTours = (req, res) => {
//   console.log(req.requestedAt);

//   res.status(200).json({
//     //jsend specification
//     status: 'success',
//     requestedAt: req.requestedAt,
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };

// const getTour = (req, res) => {
//   //req.params to read the
//   //   add '?' if want to make that parameter optional eg /:id?/:sx
//   //   console.log(req.params);
//   const { id } = req.params;

//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid Id',
//     });
//   }

//   const tour = tours.filter((el) => el.id == id);

//   res.status(200).json({
//     status: 'success',
//     // results: tours.length,
//     data: {
//       tour: tour,
//     },
//   });
// };

// const createTour = (req, res) => {
//   //   console.log(req.body);
//   // create new id
//   const newId = tours[tours.length - 1].id + 1;

//   // Object.assign merge two obj into one
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);

//   //   convert obj to json
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     () => {
//       //201 for created
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );

//   //   res.send('Done');
// };

// const updateTour = (req, res) => {
//   const { id } = req.params.id * 1;

//   const updatedTour = 'fuc';

//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid Id',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: updatedTour,
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   const { id } = req.params.id * 1;

//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid Id',
//     });
//   }

//   //no content
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

// const getAllUsers = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// };

// const createUser = (req, res) => {
//   const newId = Date.now().toString();
//   const user = Object.assign({ _id: newId }, req.body);
//   users.push(user);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user,
//     },
//   });
// };

// const getUser = (req, res) => {
//   const { id } = req.params; // Extract ID from request parameters
//   console.log(id);

//   // Find the user with the matching ID
//   const user = users.find((el) => el._id === id); // Use 'find' instead of 'filter'

//   // Check if the user exists
//   if (!user) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   }

//   // Respond with the user data
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: user,
//     },
//   });
// };

// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'fali',
//     message: 'route have not been efines',
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'fali',
//     message: 'route have not been efines',
//   });
// };

// // app.get('/api/v1/tours', getAllTours);
// // app.post('/api/v1/tours', createTour);
// // app.get('/api/v1/tours/:id', getTour);
// // app.patch('/api/v1/tours/:id', updateTour);
// // app.delete('/api/v1/tours/:id', deleteTour);

// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

// app.listen(port, () => {
//   console.log(`App running on port ${port}..`);
// });
