const Sequelize = require('../utils/database');

const { DataTypes } = require('sequelize');

const OrderItems = Sequelize.define('orderItems', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = OrderItems;