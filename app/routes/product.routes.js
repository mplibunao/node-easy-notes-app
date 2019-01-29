module.exports = app => {
  const products = require('../controllers/product.controller.js');

  app.post('/products', products.create);

  app.get('/products', products.findAll);

  app.get('/products/:productId', products.findOne);

  app.put('/products/:productId', products.update);

  app.delete('/products/:productId', products.delete);

  app.get('/products/category/:categoryId', products.findByCategoryId);
};
