const Product = require('../../models/product');

const Cart = require('../../models/cart');

const User = require('../../models/user');

// This is the middleware function which gets triggered when the "get" method for fetching all the products requested on the server.
exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
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
    Product.fetchProductById(productId).then((product) => {
        console.log('fetchProductById', product);
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product: product
        });
    }).catch((err) => {
        console.log(err);
    });
}

// This is the middleware function which gets triggered when the "get" method for rendering the a single product requested on the server.
exports.getIndexPage = (req, res, next) => {
    // Since the database methods are based on concepts of promises, here when using them it is expected to use the promise methods
    // like then() and catch() through which chaining can be made easy and readable.
    Product.findAll().then(products => {
        console.log('findAll', products);
        res.render('shop/index', {
        prods: products,
        path: '/',
        docTitle: 'Shop Page',
        });
    }).catch(err => {console.log(err)});
}

// This is the middleware function which gets triggered when the "get" method for fetching the Orders requested on the server.
exports.getOrders = (req, res, next) => {
    // res.render('shop/orders', {
    //     docTitle: 'Orders Page',
    //     path: '/orders'
    // });
}

// This is the middleware function which gets triggered when the "get" method for rendering the cart view requested on the server.
exports.getCart = (req, res, next) => {
    // req.user.cart.then(products => {
    //     return Product.fetchProductById(products._id);
    // });
    // req.user.getCart().then(cart => {
    //     console.log('from getcart - in shop.js', cart);
    //     return cart.getProducts().then(products => {
    //         console.log(products);
    //         res.render('shop/cart', {
    //         docTitle: 'Cart Page',
    //         path: '/cart',
    //         products: products[0]
    //     }).catch(err => {console.log(err)}); // catch() -> for rendering the products.
    //     }).catch(err => {console.log(err)}); // catch() -> for products;
    // }).catch(err => {console.log(err)}); // catch() -> for cart;
    
    // Cart.fetchCart(cart => {
    //     const intializationCart = (cart && Array.isArray(cart.products)) ? cart : { products: [], totalPrice: 0 };
    //     Product.findAll(product => {
    //         const cartProducts = [];
    //         for(const prod of product){
    //             const cartProductData = intializationCart.products.find(p => p.id === prod.id);
    //             if(cartProductData){
    //                 cartProducts.push({productData: prod, qty: cartProductData.qty});
    //             }
    //         }
    //         res.render('shop/cart', {
    //             docTitle: 'Cart Page',
    //             path: '/cart',
    //             products: cartProducts
    //         });
    //     });
    // });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.fetchProductById(prodId).then(product => {
        return req.user.addToCart(product)
        .then(result => res.redirect('/cart'));
    }).catch(err => {console.log(err)});
}

exports.postDeleteProductFromCart = (req, res, next) => {
    // const prodId = req.body.productId;
    // req.user.getCart().then(cart => {
    //     return cart.getProducts({where: {id: prodId}}); 
    // }).then(products => {
    //     const product = products[0];
    //     return product.cartItem.destroy();
    // }).then(() => {
    //     res.redirect('/cart');
    // }).catch(err => {console.log(err)});
}
