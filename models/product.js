// Importing the "fs" module in the file to get access to the file storage (Read/Write) functionality into the files.
const fs = require('fs');

// Importing the "path" package to build dynamic paths useful to access them in the application.
const path = require('path');

// Importing the Cart Model to access it in the Product model to use it to remove the product from the Product class when deleting it.
const Cart = require('../models/cart');

// Utility constant to store the dynamic path;
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

// Utility function to read the file before performing the save/fetch actions.
const getProductsFromFile = cb => {
fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
    });
}

module.exports = class Product{
    constructor(prodId, prodTitle, prodImageUrl, prodPrice, prodDescription){
        this.id = prodId;
        this.title = prodTitle;
        this.imageUrl = prodImageUrl;
        this.price = prodPrice;
        this.description = prodDescription
    }
    // This is the method to save the product information into a file by using the "fs" package.
    save(){
        // If id already exists for a product then it has to be updated.
        // To update the product use the fetchProductById method and find the index of the updatedProduct and replace that product.
        getProductsFromFile(products => {
            if(this.id){
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    consolr.log(err);
                });
            }
            else{
                // Adding a unique "id" for every product in order to fetch the details of individual product later when needed.
                this.id = Math.random().toString();
                // Before reading the file we have to get the access to the file which is the path of the file to perform read/write actions.
                // In order to save the data to a file first the file is to be created and checked if any information is present in that file.
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    // The Delete static function is designed to remove the products from the Products class, update the products class and then save it back to the file system.
    // So, since it is not viable to delete whole product-list it is a good idea to delete product based on the id.
    static deleteProduct(id){
        // Checking the condition where is id not avaialbe on the product for whatever reason just return.
        if(!id){
            return;
        }
        // If the id is assigned then the first step is to read the products from the file which can be done by the utility function.
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(p => p.id !== this.id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                // Once the product is efficiently deleted from the product-list, then it is appropriate to remove the item from the cart as well, if the item is present in the cart.
                if(!err){
                    Cart.deleteProductFromCart(id, product.price);
                }
                console.log(err);
            });
        });

    } 
    // This is the method to fetch all the product information.
    // This method is made static so that none of the inherited classes from this class have access to modify this method.
    static fetchAll(cb){
        // In order to fetch from a file we have to get the access to the file by pointing to the directory using path;
        getProductsFromFile(cb);
    }

    static fetchProductById(id, cb){
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}
