const Product = require('../../models/product');

const Orders = require('../../models/orders');

// const User = require('../../models/user');

// // This is the middleware function which gets triggered when the "get" method for fetching all the products requested on the server.
exports.getProducts = (req, res, next) => {

    Product.find().then(products => {
    // find() -> It is the static method provided by mongoose.
    // cursor() -> It is also an extension method by mongoose to handle large amounts of data.
        res.render('shop/product-list', {
        prods: products,
        path: '/products',
        docTitle: 'All Products',
        });
    });
}

// // This is the middleware function which gets triggered when the "get" method for fetching a single product by id requested on the server.
exports.getProductById = (req, res, next) => {
    const productId = req.params.prodId;
    // findById() -> It is the static method provided by mongoose.
    Product.findById(productId).then((product) => {
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product: product,
        });
    }).catch((err) => {
        console.log(err);
    });
}

// // This is the middleware function which gets triggered when the "get" method for rendering the a single product requested on the server.
exports.getIndexPage = (req, res, next) => {
    // Since the database methods are based on concepts of promises, here when using them it is expected to use the promise methods
    // like then() and catch() through which chaining can be made easy and readable.
    Product.find().then(products => {
        res.render('shop/index', {
        prods: products,
        path: '/',
        docTitle: 'Shop Page',
        });
    }).catch(err => {console.log(err)});
}


// This is the middleware function which gets triggered when the "get" method for rendering the cart view requested on the server.
exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
    .then((user) => {
        const products = user.cart.items;
        res.render('shop/cart',
        {
            docTitle: 'Cart Page',
            path: '/cart',
            products: products,
        });
    }).catch(err => {console.log(err)});
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId).then(product => {
        return req.user.addToCart(product);
    }).then(cart => {
        res.redirect('/cart');
        })
        .catch(err => {console.log(err)});
    }
    
    exports.postDeleteProductFromCart = (req, res, next) => {
        const prodId = req.body.productId;
        req.user.deleteItemsFromCart(prodId).then(() => {
            res.redirect('/cart');
        }).catch(err => {console.log(err)});
    }
    
    // This is the middleware function which gets triggered when the "get" method for fetching the Orders requested on the server.
    exports.getOrders = (req, res, next) => {
        Orders.find().then(orders => {
            res.render('shop/orders', {
                docTitle: 'Orders Page',
                path: '/orders',
                orders: orders,
            });
        }).catch(err => {console.log(err)});
    }

    // This is the middleware function which gets triggered when the "POST" method for fetching the Orders requested on the server.
    exports.postAddOrders = (req, res, next) => {
    // Getting access tot the products through the user data from the user collection which has the productId information,
    // and accessing it through populate() given by mongoose 
        req.user.populate('cart.items.productId')
        .then((user) => {
        const products = user.cart.items.map(i => {
            return {
                // the "productData" and "quantity" are the fields needed in the orders model.
                // since the direct data of "user.cart.items" is nested in the "productId" key, it has to be
                // transformed using the map() as per the requirements of the Orders model.

                // _doc is the mongoose extension which gives the full metadata od the document through which the complete product data can be fetched.
                productData: { ...i.productId._doc },
                quantity: i.quantity
            }
        });
        // Creating a new instance of Order model to access the Orders Data and pushing 
        // the new data into the model object and then save it in the orders collection. 
        const order = new Orders({
            userData: {
                email: req.user.email,
                userId: req.user,
            },
            product: products
        });
        return order.save();
    })
    .then(result => {
        req.user.clearCart();
        res.redirect('/orders');
    }).catch(err => {console.log(err)});
}