const Category = require('../models/category.model.js');

exports.create = (req, res) => {

  if (!req.body.name) {
    return res.status(400).send({
      message: "Category name cannot be empty"
    });
  }

  const category = new Category({
    name: req.body.name
  });

  category.save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occured while creating the category"
      });
    });
};

exports.findAll = (req, res) => {
  Category.find()
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving categories"
      });
    });
};

exports.findOne = (req, res) => {
  Category.findById(req.params.categoryId)
    .then(category => {
      if (!category) {
        return res.status(400).send({
          message: `Category not found with id ${req.params.categoryId}`
        });
      }
      res.send(category);
    })
    .catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        });
      }
      return res.status(500).send({
        message: `Error retrieving category with id ${req.params.categoryId}`
      });
    });
};

exports.update = (req, res) => {
  Category.findByIdAndUpdate(req.params.categoryId, {
    name: req.body.name,
  }, { new: true })
    .then(category => {
      if (!category) {
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        });
      }
      res.send(category);
      return res.status(500).send({
        message: `Error updating category with id ${req.params.categoryId}`
      });
    });
};

exports.delete = (req, res) => {
  Category.findByIdAndRemove(req.params.categoryId)
    .then(category => {
      if (!category) {
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        });
      }
      res.send({ message: "Category deleted successfully"});
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        });
      }
      return res.status(500).send({
        message: `Error updating category with id ${req.params.categoryId}`
      });
    });
};
