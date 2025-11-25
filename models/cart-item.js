const Sequelize = require('../utils/database');

const { DataTypes } = require('sequelize');

const CartItem = Sequelize.define('cartItem', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = CartItem;