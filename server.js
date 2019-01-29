const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();
const env = process.env.NODE_ENV || 'development';


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.mongoURI[env], {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

require('./app/routes/category.routes.js')(app);
require('./app/routes/product.routes.js')(app);

// listen for requests
module.exports = app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});
