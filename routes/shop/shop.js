const express = require('express');

const router = express.Router();

const shopController = require('../../controllers/shop/shop');

// Importing the routelock middleware to control the manual access of using the routes when user is unauthencticated.
const routelock = require('../../middleware/route-lock');

// // GET -> /
router.get('/', shopController.getIndexPage);

// // GET -> /product-list
router.get('/products', shopController.getProducts);

// // GET -> /product/id
router.get('/products/:prodId', shopController.getProductById);

// GET -> /orders
router.get('/orders', routelock, shopController.getOrders);

// POST -> /orders
router.post('/create-order', routelock, shopController.postAddOrders);

// GET -> /cart
router.get('/cart', routelock, shopController.getCart);

// POST -> /cart
router.post('/cart', routelock, shopController.postCart);

// POST -> /cart-delete-product
router.post('/cart-delete-product', routelock, shopController.postDeleteProductFromCart);

module.exports = router;