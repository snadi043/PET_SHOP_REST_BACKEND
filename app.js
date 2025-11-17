// Importing the Express Framework into the project.
// Before importing install the package using "npm install --save express" command from your terminal
const express = require('express');

// Configuring path to build the dynamic path depending on the OS of the application environments.
const path = require('path');

// Importing the body-parser package which is useful to read the data from the request body and use them in the application.
const bodyParser = require('body-parser');

// Importing the db utility module to create the connection with the database.
const db = require('./utils/database');

// Importing the error controller
const errorController = require('./controllers/error');

// Importing all the routes in the application to register in the app.js file so that routing happens in an organized manner. 
const adminProductRoutes = require('./routes/admin/admin-products');
const shopRoutes = require('./routes/shop/shop');

// Configuring the application to use express.
const app = express();

// Configuring the view engine for the application.
app.set('view engine', 'ejs');

// Configuring the views in the application to access from the "views" directory in the application.
app.set('views', 'views');

// Configuring the static method to implement styles from the css files.
app.use(express.static(path.join(__dirname, 'public')));

// Configuring the body parser for the application requirements.
app.use(bodyParser.urlencoded({extended: false}));

// This is the middleware function which gets triggered when the index page path is requested on the server.
// app.use('/', (req, res, next) => {
//     res.redirect('/');
// });

// Congiruing all the routes to be registered with the express framework.
app.use('/admin', adminProductRoutes);
app.use(shopRoutes);
app.use(errorController.getErrorPage);

// Configuring the application to listen to the port 3000 on the browser.
app.listen(3000);