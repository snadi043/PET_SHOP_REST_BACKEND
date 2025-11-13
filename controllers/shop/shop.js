const Product = require('../../models/product');

// This is the middleware function which gets triggered when the "get" method for adding the products path is requested on the server.
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
        prods: products,
        path: '/products',
        docTitle: 'All Products',
        });
    });
}

exports.getIndexPage = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
        prods: products,
        path: '/',
        docTitle: 'Shop Page',
        });
    });
}

exports.getProductDetails = (req, res, next) => {
    res.render('shop/product-details', {
        docTitle: 'Product Details Page',
        path: '/product-details'
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: 'Orders Page',
        path: '/orders'
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        docTitle: 'Cart Page',
        path: '/cart'
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        docTitle: 'Checkout Page'
    });
}