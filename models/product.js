// // // Since the progress of the application now is to work with the database, the dependencies of creating a filesystem is not necessary in the model.


// // // Importing the "fs" module in the file to get access to the file storage (Read/Write) functionality into the files.
// // // const fs = require('fs');

// // // Importing the "path" package to build dynamic paths useful to access them in the application.
// // // const path = require('path');

// // // Importing the Cart Model to access it in the Product model to use it to remove the product from the Product class when deleting it.
// // const Cart = require('../models/cart');

// // // Importing the database utility function to fetch and save the data to the database.
// // const db = require('../utils/database');

// // // Utility constant to store the dynamic path;
// // // const p = path.join(
// // //   path.dirname(process.mainModule.filename),
// // //   'data',
// // //   'products.json'
// // // );

// // // Utility function to read the file before performing the save/fetch actions.
// // // const getProductsFromFile = cb => {
// // //     fs.readFile(p, (err, fileContent) => {
// // //         if (err) {
// // //             cb([]);
// // //         } else {
// // //             cb(JSON.parse(fileContent));
// // //         }
// // //     });
// // // }

// // module.exports = class Product{
// //     constructor(prodId, prodTitle, prodImageUrl, prodPrice, prodDescription){
// //         this.id = prodId;
// //         this.title = prodTitle;
// //         this.imageUrl = prodImageUrl;
// //         this.price = prodPrice;
// //         this.description = prodDescription;
// //     }
// //     // This is the method to save the product information into a file by using the "fs" package.
// //     save(){
// //         // If id already exists for a product then it has to be updated.
// //         // To update the product use the fetchProductById method and find the index of the updatedProduct and replace that product.
// //         // getProductsFromFile(products => {
// //         //     if(this.id){
// //         //         const existingProductIndex = products.findIndex(prod => prod.id === this.id);
// //         //         const updatedProducts = [...products];
// //         //         updatedProducts[existingProductIndex] = this;
// //         //         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
// //         //             if(err) {
// //         //                 console.error('Error updating product:', err);
// //         //             }
// //         //         });
// //         //     }
// //         //     else{
// //         //         // Adding a unique "id" for every product in order to fetch the details of individual product later when needed.
// //         //         this.id = Math.random().toString();
// //         //         // Before reading the file we have to get the access to the file which is the path of the file to perform read/write actions.
// //         //         // In order to save the data to a file first the file is to be created and checked if any information is present in that file.
// //         //         products.push(this);
// //         //         fs.writeFile(p, JSON.stringify(products), (err) => {
// //         //             if(err) {
// //         //                 console.error('Error saving product:', err);
// //         //             }
// //         //         });
// //         //     }
// //         // });
// //         return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [this.title, this.price, this.imageUrl, this.description]);
// //     }

// //     // The Delete static function is designed to remove the products from the Products class, update the products class and then save it back to the file system.
// //     // So, since it is not viable to delete whole product-list it is a good idea to delete product based on the id.
// //     static deleteProduct(id){
// //         // Checking the condition where is id not avaialbe on the product for whatever reason just return.
// //         // if(!id){
// //         //     return;
// //         // }
// //         // // If the id is assigned then the first step is to read the products from the file which can be done by the utility function.
// //         // getProductsFromFile(products => {
// //         //     const product = products.find(prod => prod.id === id);
// //         //     const updatedProducts = products.filter(p => p.id !== id);
// //         //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
// //         //         // Once the product is efficiently deleted from the product-list, then it is appropriate to remove the item from the cart as well, if the item is present in the cart.
// //         //         if(!err && product){
// //         //             Cart.deleteProductFromCart(id, product.price);
// //         //         }
// //         //         if(err) {
// //         //             console.error('Error deleting product:', err);
// //         //         }
// //         //     });
// //         // });
// //         return db.execute('DELETE FROM products WHERE products.id = ?', [id]);
// //     } 
// //     // This is the method to fetch all the product information.
// //     // This method is made static so that none of the inherited classes from this class have access to modify this method.
// //     static fetchAll(){
// //         // In order to fetch from a file we have to get the access to the file by pointing to the directory using path;
// //         // getProductsFromFile(cb);

// //         // Accessing the database to fetch the data on the fetchAll method when the request is made on the server.
// //         return db.execute('SELECT * FROM products');
// //     }

// //     static fetchProductById(id){
// //         // getProductsFromFile(products => {
// //         //     const product = products.find(p => p.id === id);
// //         //     cb(product);
// //         // });
// //         return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
// //     }
// // }


// // Importing the sequelize package in the application.
// const { DataTypes } = require('sequelize');

// // Instanctiating the sequelize class to configured it in the application.
// const sequelize = require('../utils/database');

// const Product = sequelize.define('products', {
//     id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     price: {
//         type: DataTypes.DOUBLE,
//         allowNull: false,
//         validate:{min: 0, max: 1000}
//     },
//     imageUrl: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
// });

// module.exports = Product;

// Refactoring the Product Model to configure with the Mongodb Model structure.

// // Importing the db connection from the utility database.
// const getDb = require('../utils/database').getDb;

// // Importing the mongodb package to use the specific function in the model.
// const mongodb = require('mongodb');

// // The important aspect of mongodb is that it stores the "id" in the mongodb database in the format of "_id".
// // So, when any filtering is being used in the application it is important to note that "_id" is the value that has to be used.
// // Also, one other important aspect of mongodb is that the data type format of "_id" in mongodb is not just any "INTERGER" or "STRING".
// // Rather, it is of the type "ObjectID" -> So, when regular "_id" is used by itself in the application unsual functionality takes place.
// // To avoid this, mongodb package provides with ObjectID() method through which "_id" can be refactored into "ObjectId" data type.
// // const ObjectId = new mongodb.ObjectId();

// const ObjectId = mongodb.ObjectId;

// class Product{
//     constructor(title, imageUrl, price, description, id, userId){
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.price = price;
//         this.description = description;
//         this._id = id ? new ObjectId(id) : null;
//         this.userId = userId;
//     }

//     static findAll(){
//         const db = getDb();
//         return db.collection('products').find().toArray()
//         .then(product => {return product})
//         .catch(err => {console.log(err)});
//     }

//     save(){
//         const db = getDb();
//         let updatedProductObject;
//         if(this._id){
//             // Update
//             updatedProductObject = db.collection('products').updateOne({_id: this._id}, {$set:this});
//         }
//         else{
//             // Create new 
//             updatedProductObject = db.collection('products').insertOne(this);
//         }
//         return updatedProductObject
//         .then(result => {console.log(result)})
//             .catch(err => {console.log(err)});
//     }

//     static fetchProductById(prodId){
//         const db = getDb();
//         return db.collection('products').find({_id: new mongodb.ObjectId(prodId)})
//         .next()
//         .then(product => {
//             return product
//         }).catch(err => {console.log(err)});
//     }

//     static deleteProductById(id){
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
//         .then(product => {
//             console.log(product);
//         }).catch(err => console.log(err));
//     }

// }

// module.exports = Product;


// Here, refactoring the PRODUCT model to provision the concept of MONGOOSE which is ODM into the application.

// Importing Mongoose library.
const mongoose = require('mongoose');

// Importing the Schema module in the mongoose package to create customized Schema fot the PRODUCT.
const Schema = mongoose.Schema;

// Importing the User model to create a reference in MODEL format in the Product Model.
const User = require('../models/user');

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    }
});

// Exporting the schema module which intially creates the communication with the database and does all the heavy lifting
// in terms of creating queries in the backend and providing access to the inbuilt mongoose methods to work in the controllers.
module.exports = mongoose.model('Product', productSchema);