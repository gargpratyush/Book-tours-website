const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json()); //middleware: request goes through this until response is published.

app.use((req, res, next) => { //express knows the third argument passed in this function will be 'next'. We can name it whaatever we want to.
  console.log('Hello from the middleware');
  next();
})

app.use((req,res,next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime); 
  next();
})

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//ROUTE HANDLERS
const getAllTours =  (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
}
const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id*1;

  const tour = tours.find(el => el.id === id);

  //if (id>tours.length) {
    if(!tour) {
      return res.status(404).json({
        status: 'fail',
        message:'Invalid ID'
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  }
const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1; //no of elements right now + 1 will be the new element's id
  const newTour = Object.assign({id:newId}, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), 
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
}

const updateTour =  (req, res) => {
  if(req.params.id*1>tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
}

const deleteTour = (req, res) => {
  if(req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status:'fail',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}


// ROUTES
app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
//START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);

});
