const express = require('express');
const bodyParser = require('body-parser');

// Create express app
const app = express();

//parse requests of content-type - application/x-www-form-urlencoded
app.unsubscribe(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// configuring the database
const mongoose = require('mongoose');
const routes = require('./app/controllers/index');
const dbConfig = require('./config/database.config.js');
const { createdCarsQueue } = require('./app/queues/createdCars.js');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Sucessfully connected to the database');
  })
  .catch((err) => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });

// define a simples route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BHUT Cars Middleware.' });
});

// listen for requests
app.listen(3000, () => {
  createdCarsQueue.process(async () => {
    return routes.queueHook();
  });
  console.log('Server is listening on port 3000');
});

// Require Drivers routes
require('./app/routes/routes.js')(app);
