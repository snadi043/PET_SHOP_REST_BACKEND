const express = require('express');

const adminController = require('../../controllers/admin/admin');

// router is the method that is shipped with express to perfom the routing functionalities in the application.
const router = express.Router();

// The routes below which are responsible for adding/fetching the products are to be handled by the admin.
// router enables the HTTP methods to be performed on the respective controller.

// GET -> /admin.products
router.get('/products', adminController.getProducts);

// GET -> /admin/add-product
router.get('/add-products', adminController.getAddProducts);

// POST -> /admin/add-product
router.post('/add-products', adminController.postAddProducts);

// GET -> /admin/edit-product
router.get('/edit-product/:productId', adminController.getEditProduct);

// POST -> /admin/edit-product
router.post('/edit-product', adminController.postEditProduct);

// POST -> /admin/delete-product
router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router;
