// Importing the Express Framework into the project.
// Before importing install the package using "npm install --save express" command from your terminal
const express = require('express');

// Configuring path to build the dynamic path depending on the OS of the application environments.
const path = require('path');

// Importing the body-parser package which is useful to read the data from the request body and use them in the application.
const bodyParser = require('body-parser');

// Importing the db utility module to create the connection with the database.
// const sequelize = require('./utils/database');

// Importing the MongoClient from the utility directory to create the connection to the "MONGODB" backend database.
const mongoConnect = require('./utils/database').mongoConnect;

// Importing the error controller
const errorController = require('./controllers/error');

//Importing the models to build the association relationship between them in conjucion with the database interactions.
// const Product = require('./models/product');
// const Cart = require('./models/cart');
// const CartItems = require('./models/cart-item');
// const User = require('./models/user');
// const Orders = require('./models/orders');
// const OrderItems = require('./models/order-item');

// Importing all the routes in the application to register in the app.js file so that routing happens in an organized manner. 
const adminProductRoutes = require('./routes/admin/admin-products');
const shopRoutes = require('./routes/shop/shop');

// Importing the models to use them to create neccessary actions in the application.
const User = require('./models/user');

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

// Creating a middleware to manually log user into the application by injecting the user onto the request.
app.use((req, res, next) => {
    User.findUserById("69287ef76336cc40695cc698").then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id); // This is the format using which you can add fields to the request "apart from already registered keywords in the request".
        next();
    }).catch(err => {console.log(err)});
});

// Congiruing all the routes to be registered with the express framework.
app.use('/admin', adminProductRoutes);
app.use(shopRoutes);
app.use(errorController.getErrorPage);

// Here, before syncing the data to the database, any associations between the datatables should be registered.
// Associations are the one of the important concepts in SEQUELIZE library.

// lines 55 & 56 creates an association between User and Product Models.
// Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); 
// User.hasMany(Product);

// // Lines 66 & 67 creates an association between User, Product and Cart Models.
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Product.belongsToMany(Cart, {through: CartItems});
// Cart.belongsToMany(Product, {through: CartItems});
// Orders.belongsTo(User);
// User.hasMany(Orders);
// Orders.belongsToMany(Product, {through: OrderItems});
// Product.belongsToMany(Orders, {through: OrderItems});

// Importing the database connection module here to connect it with the application.
// sequelize.sync().then((result) => {
//     return User.findByPk(1);
// }).then((user) => {
//     if(!user){
//         User.create({name: 'SAI', email: 'test@test.com'});
//     }
//     return user;
// }).then(user => {
//     return user.createCart();
// }).then(cart => {
//     app.listen(3000);
// })
// .catch(err => {console.log(err)});

// Using the Sequelize exports 
// Configuring the application to listen to the port 3000 on the browser.


mongoConnect(() => {
    app.listen(3000);
});