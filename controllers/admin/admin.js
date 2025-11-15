const Product = require('../../models/product');

// This is the middleware function which gets triggered when the "get" method for adding the products path is requested on the server.
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
        prods: products,
        path: '/admin/products',
        docTitle: 'Admin Products'
        });  
    });
}

// This is the middleware function which gets triggered when the "get" method for adding the products path is requested on the server.
exports.getAddProducts = (req, res, next) => {
    res.render('admin/add-product', {
        path: '/admin/add-products',
        docTitle: 'Products Page',
    });
}

// This is the middleware function which gets triggered when the "post" method for adding the products path is requested on the server.
exports.postAddProducts = (req, res, next) => {
    const title = req.body.prod_title;
    const imageUrl = req.body.prod_imageUrl;
    const price = req.body.prod_price;
    const description = req.body.prod_description;

    const product = new Product(title, imageUrl, price, description);
    product.save();
    res.redirect('/');
};

// This is the middleware function which gets triggered when the "get" method for editing the products path is requested on the server.
exports.getEditProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Edit Product Page',
        path: '/admin/edit-product'
    });
}

// This is the middleware function which gets triggered when the "post" method for editing the products path is requested on the server.
exports.postEditProduct = (req, res, next) => {
    res.redirect('/admin/add-products');
}

// This is the middleware function which gets triggered when the "post" method for deleting the products path is requested on the server.
exports.postDeleteProduct = (req, res, next) => {
    res.render('admin/products', {
        path: '/admin/delete-products',
        docTitle: 'Delete Product Page'
    });
}