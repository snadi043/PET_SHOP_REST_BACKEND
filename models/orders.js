const Sequelize = require('../utils/database');

const { DataTypes } = require('sequelize');

const Orders = Sequelize.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = Orders;