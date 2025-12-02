const express = require('express');

const router = express.Router();

const shopController = require('../../controllers/shop/shop');

// // GET -> /
router.get('/', shopController.getIndexPage);

// // GET -> /product-list
router.get('/products', shopController.getProducts);

// // GET -> /product/id
router.get('/products/:prodId', shopController.getProductById);

// GET -> /orders
router.get('/orders', shopController.getOrders);

// POST -> /orders
router.post('/create-order', shopController.postAddOrders);

// GET -> /cart
router.get('/cart', shopController.getCart);

// POST -> /cart
router.post('/cart', shopController.postCart);

// POST -> /cart-delete-product
router.post('/cart-delete-product', shopController.postDeleteProductFromCart);

module.exports = router;