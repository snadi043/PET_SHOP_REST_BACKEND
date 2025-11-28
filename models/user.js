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
        const updatedCart = {items: [{productId: new ObjectId(product._id), quantity: 1}]};
        const db = getDb();
        return db.collection('users').updateOne({_id: this._id}, {$set:{cart: updatedCart}})
        .then((cart) => {
            console.log('addToCart', cart);
            return cart;
        }).catch(err => {console.log(err)});
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