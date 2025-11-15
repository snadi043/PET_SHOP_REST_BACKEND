const Product = require('../../models/product');

// This is the middleware function which gets triggered when the "get" method for fetching all the products requested on the server.
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
        prods: products,
        path: '/products',
        docTitle: 'All Products',
        });
    });
}

// This is the middleware function which gets triggered when the "get" method for fetching a single product by id requested on the server.
exports.getProductById = (req, res, next) => {
    const productId = req.params.prodId;
    Product.fetchProductById(productId, product => {
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product: product
        });
    });
}

// This is the middleware function which gets triggered when the "get" method for rendering the a single product requested on the server.
exports.getIndexPage = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
        prods: products,
        path: '/',
        docTitle: 'Shop Page',
        });
    });
}

// This is the middleware function which gets triggered when the "get" method for fetching the Orders requested on the server.
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: 'Orders Page',
        path: '/orders'
    });
}

// This is the middleware function which gets triggered when the "get" method for rendering the cart view requested on the server.
exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        docTitle: 'Cart Page',
        path: '/cart'
    });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
}

// This is the middleware function which gets triggered when the "get" method for rendering the checkout view requested on the server.
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        docTitle: 'Checkout Page'
    });
}