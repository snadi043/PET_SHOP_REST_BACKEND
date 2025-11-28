// const Sequelize = require('../utils/database');

// const {DataTypes } = require('sequelize');

// const User = Sequelize.define('users', {
//     id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email:{
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });

// module.exports = User;

const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

const getDb = require('../utils/database').getDb;

class User{
    constructor(username, email, cart, id){
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = new ObjectId(id); 
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this)
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => {console.log(err)});
    }

    addToCart(product){
        // Accessing the updatedCartItems to then check if the products in the cart are existing or new proudcts.
        const updatedCartItems = [ ...this.cart.items ];

        // This is the check where a product which the user wants to add to the cart already exists in the cart.
        // In this case, the quantity has to be altered by adding 1 to the existing quantity;
        const updatedCartItemIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() == product._id.toString();
        });

        let newQuantity = 1;

        // Checking the condition if Index returns 1 then item exists in the cart.
        if(updatedCartItemIndex >= 0){
            newQuantity = this.cart.items[updatedCartItemIndex].quantity + 1;
            updatedCartItems[updatedCartItemIndex].quantity = newQuantity;
        }
        else{
            updatedCartItems.push({productId: new ObjectId(product._id), newQuantity});
        }
        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users').updateOne({_id: this._id}, {$set:{cart: updatedCart}});
    }

    getCart(){
        // This method has to finally return the product which holds the product title and product qunatity to render on the cart page.
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db.collection('products').find({_id: {$in: productIds}}).toArray().then(product => {
            return product.map(p => {
                return {
                    ...p,
                    quantity: this.cart.items.find(i => {
                        return i.productId.toString() === p._id.toString();
                    }).quantity
                }
            });
        });
    }

    static findUserById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id: new ObjectId(userId)})
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => {console.log(err)});
    }
}

module.exports = User;