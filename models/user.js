const Sequelize = require('../utils/database');

const {DataTypes } = require('sequelize');

const User = Sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        isNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = User;