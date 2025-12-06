// // Importing the mongodb package to use the specific function in the model.
// const mongodb = require('mongodb');

const Product = require('../../models/product');

// // This is the middleware function which gets triggered when the "get" method for adding the products path is requested on the server.
exports.getProducts = (req, res, next) => {
    // find() -> It is the static method provided by mongoose.
    // cursor() -> It is also an extension method by mongoose to handle large amounts of data.
    Product.find().then(products => {
        console.log('getAdminProducts', products);
        res.render('admin/products', {
        prods: products,
        path: '/admin/products',
        docTitle: 'Admin Products',
    });
    }).catch(err => {console.log(err)});
;
}

// // This is the middleware function which gets triggered when the "get" method for adding the products path is requested on the server.
exports.getAddProducts = (req, res, next) => {
    Product.find().then(() => {
        res.render('admin/edit-product', {
        path: '/admin/add-products',
        docTitle: 'Add Product Page',
        editing: false,
    });
    }).catch(err => {console.log(err)});
}

// // This is the middleware function which gets triggered when the "post" method for adding the products path is requested on the server.
exports.postAddProducts = (req, res, next) => {
    const title = req.body.prod_title;
    const imageUrl = req.body.prod_imageUrl;
    const price = req.body.prod_price;
    const description = req.body.prod_description;
    
    // Using the instance of the Product model to save an Object of the data to the "shop" collection as a single document.
    const product = new Product(
        {
            title: title, 
            imageUrl: imageUrl, 
            price: price, 
            description: description,
            userId: req.user, // mongoose behind the screen grabs the userId from the req since a reference is created between User and Product Models.
        });
    product.save()
    .then(product => {
        console.log('AddAdminProducts', product);
        res.redirect('/admin/products');
    })
    .catch(err => {console.log(err)});
};

// // This is the middleware function which gets triggered when the "get" method for editing the products path is requested on the server.
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit; // edit is the key on the query which holds the boolean value and this provision is given by node to pass information about a particular item in the application to use else where.
    // In order to edit a unique product it is to be determined by the id of the product which can be evaluated by using the Product model
    const productId = req.params.productId; // productId is passed as params from inside of the form.
    // This is the condition if the query parameter is not present, then redirect to index page.
    if(!editMode){
        return res.redirect('/');
    }
    // Condition to handle if the "entered id" is not an valid id attached to the product then return to the index page.
    Product.findById(productId).then(product => {
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

// // This is the middleware function which gets triggered when the "post" method for editing the products path is requested on the server.
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.prod_title;
    const updatedImageUrl = req.body.prod_imageUrl;
    const updatedPrice = req.body.prod_price;
    const updatedDescription = req.body.prod_description;

    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.imageUrl = updatedImageUrl;
        product.price = updatedPrice;
        product.description = updatedDescription;
        return product.save();
    }).then((product => {
        console.log('UpdatedAdminProduct', product);
        res.redirect('/admin/products');
    })).catch(err => {
        console.log(err);
    });
}

// // This is the middleware function which gets triggered when the "post" method for deleting the products path is requested on the server.
exports.postDeleteProduct = (req, res, next) => {
    // Since delete is a POST method, the productId can be made accessible by using the input hidden type on the template body.
    const prodId = req.body.productId;
    Product.findByIdAndDelete(prodId).then((product) => {
        console.log('AdminProductDeleted', product);
        res.redirect('/admin/products');
    }).catch((err) => {console.log(err)});
}