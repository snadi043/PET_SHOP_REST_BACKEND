const express = require('express');

const adminController = require('../../controllers/admin/admin');

// router is the method that is shipped with express to perfom the routing functionalities in the application.
const router = express.Router();

// Importing the routelock middleware to control the manual access of using the routes when user is unauthencticated.
const routelock = require('../../middleware/route-lock');

// The routes below which are responsible for adding/fetching the products are to be handled by the admin.
// router enables the HTTP methods to be performed on the respective controller.

// // GET -> /admin.products
router.get('/products', routelock, adminController.getProducts);

// // GET -> /admin/add-product
router.get('/add-products', routelock, adminController.getAddProducts);

// // POST -> /admin/add-product
router.post('/add-products', routelock, adminController.postAddProducts);

// // GET -> /admin/edit-product
router.get('/edit-product/:productId', routelock, adminController.getEditProduct);

// // POST -> /admin/edit-product
router.post('/edit-product', routelock, adminController.postEditProduct);

// // POST -> /admin/delete-product
router.post('/delete-product', routelock, adminController.postDeleteProduct);

module.exports = router;
