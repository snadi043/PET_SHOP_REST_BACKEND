const Product = require('../../models/product');

// This is the middleware function which gets triggered when the "get" method for adding the products path is requested on the server.
exports.getProduct = (req, res, next) => {
    const products = Product.fetchAll();
    console.log(products);
    res.render('products', {
        prods: products,
        path: '/',
        docTitle: 'Product Page',
    });
}

// This is the middleware function which gets triggered when the "get" method for adding the products path is requested on the server.
exports.getAddProducts = (req, res, next) => {
    res.render('add-product', {
        path: '/admin/add-products',
        docTitle: 'Products Page',
    });
}

// This is the middleware function which gets triggered when the "post" method for adding the products path is requested on the server.
exports.postAddProducts = (req, res, next) => {
    const product = new Product(req.body.prod_title);
    product.save();
    res.redirect('/');
}