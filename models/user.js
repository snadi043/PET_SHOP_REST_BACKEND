// const mongoDB = require('mongodb');

// const ObjectId = mongoDB.ObjectId;

// const getDb = require('../utils/database').getDb;

// class Users{
//   constructor(username, email, cart, id){
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: [{}]}
//     this._id = id;
//   }

//   save(){
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   static getUserById(userId){
//     const db = getDb();
//     return db.collection('users').findOne({_id: new ObjectId(userId)});
//   }

//   // addToCart() is the method which depends upon the userId and makes a relation between user and the cart.
//   // Based on the userId, the cart gets the access to add the products.
//   addToCart(product){
//     // Cheking if the product is existing in the cart already in the collection by comparing the indexes
//     const cartProdutIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items] // getting access to all the items in the cart so that they can be edited as per the conditions.
//     // If the product is already existing then increase the quantity by 1.
//     if(cartProdutIndex >= 0){
//       newQuantity = this.cart.items[cartProdutIndex].quantity + 1; 
//       updatedCartItems[cartProdutIndex].quantity = newQuantity;
//     }
//     // If it is new product then create a new object of the item with the product data and the quantity with the push() method.
//     else{
//       updatedCartItems.push({productId: new ObjectId(product._id), newQuantity});
//     }
//     // updatedCart is basically the format/schema of the cart that is to be stored in the users collection.
//     // Finally always passing the information of the updatedCartItems to the updatedCart.
//     const updatedCart = {items: updatedCartItems}; 
//     const db = getDb(); // getting the access to the database connection.
//     return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}})
//   }

//   getCart(){
//     const db = getDb();
//     const productIds = this.cart.items.map(i => { 
//       return i.productId;
//   });
//     return db.collection('products').find({_id: {$in: productIds}}).toArray()
//     .then(products => {
//       return products.map(p => {
//         return {
//           ...p, quantity: this.cart.items.find(i => {
//             return i.productId.toString() === p._id.toString();
//           }).quantity
//         }
//       });
//     });
//   }

//   deleteItemsFromCart(productId){
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(products => {
//       return products.productId.toString() !== productId.toString();
//     })
//     return db.collection('users').updateOne({_id: new Object(this._id)}, {$set: {cart: {items: updatedCartItems}}});
//   }

//   addOrders(){
//     const db = getDb();

//     // Order has to contain the details about the product and the user.
//     // So, in this user model, we can access the cart to get the product information using the relations concept.
//     return this.getCart().then(products => {
//         const order = {
//             items: products,
//             user: {
//                 _id: new ObjectId(this._id),
//                 name: this.name
//             }
//         };
//         return db.collection('orders').insertOne(order);
//     }).then(result => {
//         this.cart = {items: []};
//         return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: [] } }});
//     }).catch(err => {console.log(err)});
//   }

//   getOrders(){
//     const db = getDb();
//     return db.collection('orders').find({'user._id': new Object(this._id)}).toArray();
//   }

// }
// module.exports = Users;


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiryTime: Date,
  cart:{
    items: [{
      productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
  }
});


// Mongoose gives the flexibility to add the utility / custom methods to the model.
userSchema.methods.addToCart = function(product){
  // addToCart() is the method which depends upon the userId and makes a relation between user and the cart.
  // Based on the userId, the cart gets the access to add the products.

    // Cheking if the product is existing in the cart already in the collection by comparing the indexes
    const cartProdutIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items] // getting access to all the items in the cart so that they can be edited as per the conditions.
    // If the product is already existing then increase the quantity by 1.
    if(cartProdutIndex >= 0){
      newQuantity = this.cart.items[cartProdutIndex].quantity + 1; 
      updatedCartItems[cartProdutIndex].quantity = newQuantity;
    }
    // If it is new product then create a new object of the item with the product data and the quantity with the push() method.
    else{
      updatedCartItems.push({productId: product._id, quantity: newQuantity});
    }
    // updatedCart is basically the format/schema of the cart that is to be stored in the users collection.
    // Finally always passing the information of the updatedCartItems to the updatedCart.
    const updatedCart = {items: updatedCartItems};

    this.cart = updatedCart;

    return this.save();
  }

  userSchema.methods.deleteItemsFromCart = function (productId){
    const updatedCartItems = this.cart.items.filter(products => {
      return products.productId.toString() !== productId.toString();
    })
   this.cart.items = updatedCartItems;
   return this.save();
  }

  userSchema.methods.clearCart = function(){
    this.cart = {items: []};
    return this.save();
  }

module.exports = mongoose.model('User', userSchema);