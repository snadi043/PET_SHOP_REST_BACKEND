const Product = require('../../models/product');

// This is the middleware function which gets triggered when the "get" method for adding the products path is requested on the server.
exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('admin/products', {
        prods: products,
        path: '/admin/products',
        docTitle: 'Admin Products'
    });
    }).catch(err => {console.log(err)});
;
}

// This is the middleware function which gets triggered when the "get" method for adding the products path is requested on the server.
exports.getAddProducts = (req, res, next) => {
    Product.findAll().then(() => {
        res.render('admin/edit-product', {
        path: '/admin/add-products',
        docTitle: 'Add Product Page',
        editing: false
    })
    }).catch(err => {console.log(err)});
}

// This is the middleware function which gets triggered when the "post" method for adding the products path is requested on the server.
exports.postAddProducts = (req, res, next) => {
    const title = req.body.prod_title;
    const imageUrl = req.body.prod_imageUrl;
    const price = req.body.prod_price;
    const description = req.body.prod_description;
    // After the associations are configured in the app.js file before the sync of the database, SEQUELIZE provides the concept of magic methods.
    // Magic methods are basically the custom methods based on the action followed by the model once the assocaition between the models are created.
    // In this case createProduct(); -> This magic method will take care of creating the metadata about the user when creating a new product usinf admin controllers.
    // So by implementing the magic methods a way of logging users feature is created.
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     userId: req.user.id,
    // }).then(result => {
    //     console.log('admin.js - postAddProducts', result);
    //     res.redirect('/admin/products');
    // }).catch(err => {console.log(err)});
    
    const product = new Product(title, imageUrl, price, description);
    product.save()
    .then(result => {
        res.redirect('/admin/products');
        console.log(result);
    })
    .catch(err => {console.log(err)});
};

// This is the middleware function which gets triggered when the "get" method for editing the products path is requested on the server.
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit; // edit is the key on the query which holds the boolean value and this provision is given by node to pass information about a particular item in the application to use else where.
    // In order to edit a unique product it is to be determined by the id of the product which can be evaluated by using the Product model
    const productId = req.params.productId; // productId is passed as params from inside of the form.
    console.log(productId);
    // This is the condition if the query parameter is not present, then redirect to index page.
    if(!editMode){
        return res.redirect('/');
    }
    // Condition to handle if the "entered id" is not an valid id attached to the product then return to the index page.
    Product.fetchProductById(productId).then(product => {
        console.log('getEditProduct', product);
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            docTitle: 'Edit Product Page',
            path: '/admin/edit-product',
            editing: editMode, // now this meta data can be accessed on the view template to dynamically alter the view based on the "editing" parameter value.
            product: product,
        });
    }).catch(err => {console.log(err)});
}

// This is the middleware function which gets triggered when the "post" method for editing the products path is requested on the server.
// exports.postEditProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     const updatedTitle = req.body.prod_title;
//     const updatedImageUrl = req.body.prod_imageUrl;
//     const updatedPrice = req.body.prod_price;
//     const updatedDescription = req.body.prod_description;
//     // Here, when using SEQUELIZE, it is good pratice to first identify which item is supposed to be updated by using prodId.
//     // Once, prodId is retrieved then, first save the updated information locally and then save it to the databse using "SEQUELIZE" save() method.
//     Product.findByPk(prodId).then(product => {
//         product.title = updatedTitle;
//         product.imageUrl = updatedImageUrl;
//         product.price = updatedPrice;
//         product.description = updatedDescription;
//         return product.save();
//     }).then((result => {
//         console.log(result);
//         res.redirect('/admin/products');
//     })).catch(err => {
//         console.log(err);
//     });
// }

// This is the middleware function which gets triggered when the "post" method for deleting the products path is requested on the server.
// exports.postDeleteProduct = (req, res, next) => {
//     // Since delete is a POST method, the productId can be made accessible by using the input hidden type on the template body.
//     const prodId = req.body.productId;
//     Product.fetchProductById(prodId).then((product) => {
//         console.log('deleteById', product);
//         return product;
//     }).then(() => {
//         res.redirect('/admin/products');
//     }).catch((err) => {console.log(err)});
// }