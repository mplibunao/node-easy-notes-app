const User = require('../models/user.model.js');
const Notes = require('../models/note.model.js');

// Create and Save a new Note
exports.create = (req, res) => {

    // Validate request
    if(!req.body.firstName) {
        return res.status(400).send({
            message: "First name can not be empty"
        });
    }
    if(!req.body.lastName) {
        return res.status(400).send({
            message: "Last name can not be empty"
        });
    }
    if(!req.body.phoneNumber) {
        return res.status(400).send({
            message: "Phone number can not be empty"
        });
    }

    // Create a Note
    const user = new User({
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
	    phoneNumber: req.body.phoneNumber
    });

    // Save Note in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating user."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(user => {
        res.send(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findUsernotes = (req, res) => {
    Note.where({userId: req.params.userId})
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};


// Update a note identified by the noteId in the request
exports.update = (req, res) => {

    // Find note and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
        firstName: req.body.firstName,
	lastName: req.body.lastName,
	phoneNumber: req.body.phoneNumber      
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.userId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};
