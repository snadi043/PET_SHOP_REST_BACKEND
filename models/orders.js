// const Sequelize = require('../utils/database');

// const { DataTypes } = require('sequelize');

// const Orders = Sequelize.define('orders', {
//     id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     }
// });

// module.exports = Orders;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    // Orders model should have mainly two properties of data 
    // 1 -> Product -> This is an array of Objects which contains productData abd quantity.  
    // 2 -> UserData -> This is an object which has username and a relation witht the User model through ref.
    product:[{
        productData: {type: Object, required: true},
        quantity: {type: Number, required: true}
    }],
    userData: {
         username: {
            type: String,
            required: true,
            ref: 'User'
         },
         userId:{
            type: mongoose.Types.ObjectId,
            required: true
         }
    }
});

module.exports = mongoose.model('orders', ordersSchema);