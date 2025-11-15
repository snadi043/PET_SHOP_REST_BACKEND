const express = require('express');

const router = express.Router();

const shopController = require('../../controllers/shop/shop');

// GET -> /
router.get('/', shopController.getIndexPage);

// GET -> /product-list
router.get('/products', shopController.getProducts);

// GET -> /product/id
router.get('/products/:prodId', shopController.getProductById);

// GET -> /product-details
// router.get('/product-details', shopController.getProductDetails);

// GET -> /checkout
router.get('/checkout', shopController.getCheckout);

// GET -> /orders
router.get('/orders', shopController.getOrders);

// GET -> /cart
router.get('/cart', shopController.getCart);

// POST -> /cart
router.post('/cart', shopController.postCart);

module.exports = router;