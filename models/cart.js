const fs = require('fs');
const path = require('path');

// This is an global variable to construct the dynamic path in the directory of the project to read/write to the fileSystem.
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

// The purpose of this class Cart is to store the details about the product and its information like quantity of products and total price.

module.exports = class Cart{
    static addToCart(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            let cart = {product: [], totalPrice: 0};
            // If there is no error in reading the file then configuring to parse the data from the file which is expected to be in JSON format.
            if(!err){
                cart = { ...JSON.parse(fileContent)};
            }
            // If product is already in the cart -> then update the quantity by 1 and finally add the price to the total price.
            
            // Identifying the product is already in the cart.
            // For this to achieve, an "id" is expected for the product which is already achieved from the addProduct functionality from the "POST" method in the "PRODUCT" model.
            const existingProductIndex = cart.product.findIndex(p => p.id === id); // the find method return true if the id's are matched, which is how it can be determined that product already exists in the cart.
            const existingProduct = cart.product[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                // update the product with the quantity by 1.
                // Also from the line 12, in the cart oject we expect a product array and it must have a quantity which can be accessed by "qty" key.
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.product = [ ...cart.product ];
                cart.product[existingProductIndex] = updatedProduct;
            }
            // the else condition is for product which is new to the cart.
            else{
                updatedProduct = {id: id, qty: 1};
                cart.product = [ ...cart.product, updatedProduct];
            }
            // Updating the cart after both the cases with totalPrice using the expected productPrice from the Cart class.
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }
}