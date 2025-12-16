const Product = require('../../models/product');

const Orders = require('../../models/orders');

const ITEMS_PER_PAGE = 1;

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
    const page = +req.params.page || 1;
    let totalItems;
    // Since the database methods are based on concepts of promises, here when using them it is expected to use the promise methods
    // like then() and catch() through which chaining can be made easy and readable.
    Product.find()
    .countDocuments()
    .then(totalDocuments => {
        totalItems = totalDocuments;
        return Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE) // skip() -> finalizes how many items has to be skipped from initial set of data to show on the next pages.
            .limit(ITEMS_PER_PAGE) // limit() -> returns how many items has to be shown in each page.
    })
    .then(products => {
        res.render('shop/index', {
        prods: products,
        path: '/',
        docTitle: 'Shop Page',
        totalItems: totalDocuments,
        currentPage: page, // Defines which is the current page.
        nextPage: page + 1, // Defines next page in the series of pages.
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        hasPreviousPage: page > 1,
        });
    }).catch(err => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    });
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
    }).catch(err => {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    });
}