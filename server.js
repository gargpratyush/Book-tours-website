const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD); //replaces <PASSWORD> with our password

//write the following stuff without thinking every time you want to connect it to a mongoose database.
mongoose.connect(DB, {
  useNewUrlParser:true,
  useCreateIndex: true,
  useFindAndModify:false
}).then(() =>
  console.log('DB connection successful!'));


//TESTING

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997
// })

// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.log('ERROR👺:', err);
//   })

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
