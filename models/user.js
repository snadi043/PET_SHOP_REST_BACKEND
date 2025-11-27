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
    constructor(username, email){
        this.username = username;
        this.email = email;
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