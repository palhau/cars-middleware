module.exports = (app) => {
  const routes = require('../controllers/index.js');

  app.post('/api/createCar', routes.create);

  app.get('/api/listCars', routes.list);

  app.get('/api/logs', routes.logs);

  app.post('/api/hook', routes.queueHook); // Internal use only
}