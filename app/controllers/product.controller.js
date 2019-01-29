const Product = require('../models/product.model.js');

exports.create = (req, res) => {
  // Validation
  if (!req.body.name) {
    return res.status(400).send({
      message: "Product name cannot be empty"
    });
  }
  if (!req.body.categoryId) {
    return res.status(400).send({
      message: "CategoryId cannot be empty"
    });
  }
  if (!req.body.description) {
    return res.status(400).send({
      message: "Description cannot be empty"
    });
  }
  if (!req.body.price) {
    return res.status(400).send({
      message: "Price cannot be empty"
    });
  }

  // Create a new `Product` instance using the model required above (Product)
  // and assign the new Product instance to `const product` variable
  const product = new Product({
    name: req.body.name,
    categoryId: req.body.categoryId,
    description: req.body.description,
    price: req.body.price,
  });

  // const product has a `.save()` method
  product.save()
  // After saving, the product is returned (you can name it data, productData or whatever you want)
  // And access product fields like data.id, data.name, data.price
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating product."
      });
    });
};

exports.findAll = (req, res) => {
  Product.find()
    .then(user => {
      res.send(user);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving products"
      });
    });
};

exports.findByCategoryId = (req, res) => {
  Product.where({ categoryId: req.params.categoryId })
    .then(product => {
      res.send(product);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving notes"
      });
    });
};

exports.findOne = (req, res) => {
  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(400).send({
          message: `Product not found with id ${req.params.productId}`
        });
      }
      res.send(product);
    }).catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Product not found with id ${req.params.productId}`
        });
      }
      return res.status(500).send({
        message: `Error retrieving product with id ${req.params.productId}`
      });
    });
};

exports.update = (req, res) => {
  Product.findByIdAndUpdate(req.params.productId, {
    name: req.body.name,
    categoryId: req.body.categoryId,
    description: req.body.description,
    price: req.body.price,
  }, { new: true })
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: `Product not found with id ${req.params.productId}`
        });
      }
      res.send(product);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Product not found with id ${req.params.productId}`
        });
      }
      return res.status(500).send({
        message: `Error updating product with id ${req.params.productId}`
      });
    });
};

exports.delete = (req, res) => {
  Product.findByIdAndRemove(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: `Product not found with id ${req.params.productId}`
        });
      }
      res.send({ message: "Product deleted successfully"});
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Product not found with id ${req.params.productId}`
        });
      }
      return res.status(500).send({
        message: `Error updating product with id ${req.params.productId}`
      });
    });
};
