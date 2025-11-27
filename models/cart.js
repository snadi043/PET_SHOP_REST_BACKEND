// const fs = require('fs');
// const path = require('path');

// // This is an global variable to construct the dynamic path in the directory of the project to read/write to the fileSystem.
// const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

// // The purpose of this class Cart is to store the details about the product and its information like quantity of products and total price.

// module.exports = class Cart{
//     static addToCart(id, productPrice){
//         fs.readFile(p, (err, fileContent) => {
//             let cart = {products: [], totalPrice: 0};
//             // If there is no error in reading the file then configuring to parse the data from the file which is expected to be in JSON format.
//             if(!err && fileContent){
//                 try{
//                     const parsedContent = JSON.parse(fileContent);
//                     cart = {
//                         products: Array.isArray(parsedContent.products) ? parsedContent.products : [],
//                         totalPrice: typeof parsedContent.totalPrice === 'number' ? parsedContent.totalPrice : 0
//                     }
//                 }
//                 catch(parseError){
//                     console.error('Error parsing cart.json', parseError);
//                 }
//             }
//             // If product is already in the cart -> then update the quantity by 1 and finally add the price to the total price.
            
//             // Identifying the product is already in the cart.
//             // For this to achieve, an "id" is expected for the product which is already achieved from the addProduct functionality from the "POST" method in the "PRODUCT" model.
//             const existingProductIndex = cart.products.findIndex(p => p.id === id); // the find method return true if the id's are matched, which is how it can be determined that product already exists in the cart.
//             const existingProduct = cart.products[existingProductIndex];
//             let updatedProduct;
//             if(existingProduct){
//                 // update the product with the quantity by 1.
//                 // Also from the line 12, in the cart oject we expect a product array and it must have a quantity which can be accessed by "qty" key.
//                 updatedProduct = { ...existingProduct };
//                 updatedProduct.qty = (updatedProduct.qty || 0) + 1;
//                 cart.products = [ ...cart.products ];
//                 cart.products[existingProductIndex] = updatedProduct;
//             }
//             // the else condition is for product which is new to the cart.
//             else{
//                 updatedProduct = {id: id, qty: 1};
//                 cart.products = [ ...cart.products, updatedProduct];
//             }
//             // Updating the cart after both the cases with totalPrice using the expected productPrice from the Cart class.
//             const validPrice = Math.max(0, parseFloat(productPrice) || 0);
//             cart.totalPrice = cart.totalPrice + validPrice;
//             fs.writeFile(p, JSON.stringify(cart), (err) => {
//                 if(err) {
//                     console.error('Error updating cart:', err);
//                 }
//             });
//         });
//     }

//     // Delete product from the cart is the static function that has to be able to remove the product along with the removal of respective
//     // quantity from the cart and also the price assigned to the products. 

//     // To delete a particular product from the cart again it is required to access the id.
//     static deleteProductFromCart(id, productPrice){
//         // In order to get the access to the id, the fileSystem has to be accessed.
//         fs.readFile(p, (err, fileContent) => {
//             // If there is an error in reading the file just return.
//             if(err){
//                 return;
//             }
//             let parsedContent;
//             try{
//                 parsedContent = JSON.parse(fileContent);
//             }
//             catch(parseError){
//                 console.error('Error parsing cart.json for delete:', parseError);
//                 return;
//             }
//             const updatedCart = {...JSON.parse(fileContent)};
//             const product = updatedCart.products.find(prod => prod.id === id);
//             if(!product){
//                 return;
//             }
//             const productQty = product.qty || 1;
//             const validPrice = Math.max(0, parseFloat(productPrice) || 0);
//             updatedCart.products = updatedCart.products.filter(p => p.id !== id);
//             updatedCart.totalPrice = Math.max(0, updatedCart.totalPrice - (validPrice * productQty));
//             fs.writeFile(p, (JSON.stringify(updatedCart)), (err) => {
//                 if(err) {
//                     console.error('Error updating cart after deletion:', err);
//                 }
//             });
//         });
//     }

//     // Fetch the products in the cart to display if the products exists in the cart on the cart template.
//     static fetchCart(cb){
//         fs.readFile(p, (err, fileContent) => {
//             if(err){
//                 console.error('Error reading cart file:', err);
//                 cb(null);
//             }
//             else{
//                 cb(JSON.parse(fileContent)); 
//             }
//         });
//     }
// }


// const Sequelize = require('../utils/database');

// const { DataTypes } = require('sequelize');

// const Cart = Sequelize.define('cart', {
//     id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     }
// });

// module.exports = Cart;