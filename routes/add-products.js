const express = require('express');

const productController = require('../controllers/admin/products');

// router is the method that is shipped with express to perfom the routing functionalities in the application.
const router = express.Router();

// The routes below which are responsible for adding/fetching the products are to be handled by the admin.
// router enables the HTTP methods to be performed on the respective controller.


// GET -> /admin/add-product
router.get('/add-products', productController.getAddProducts);

// POST -> /admin/add-product
router.post('/add-products', productController.postAddProducts);

module.exports = router;
