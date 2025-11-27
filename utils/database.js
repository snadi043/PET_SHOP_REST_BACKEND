// // Importing the mysql package from the npm mysql package to confiugre it in the application and overcome the complex issues facing with
// // fileSystems while reading and retriving the data from it. So, by using the database like MYSQL, the data can be handled more efficiently
// // and systematically over scalable information.

// // Importing mysql 
// const mysql = require('mysql2');

// // Configuring the database to create a pool of connection for every single request made to the server, so that the concept of promises in the
// // mysql environment is used perfectly to handle multiple request asynchronously. 
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'online-pet-shop',
//     password: 'swathiKumar@18'
// });

// // exporting this db object to reuse in all the required places of the application to create an individual connection for every indivdual request.
// module.exports = pool.promise();

// Previously, the application was configured with the mysql2 package to replace the difficulties with reading / uploading the data to the file system.
// So by using the MYSQL, the developers has to take the effort to write the SQL queries to perforom the required actions like (CRUD) on the database.
// Also, the database connection and the configuration of the application to the data tables in the database is also managed by the developers.
// Instead to doing all the above mentioned heavy-lifting tasks by the developers there is an alternative way which is using the "SEQUELIZE" package.
// The "SEQUELIZE" package helps to create "MODELS" with highly "TYPED" dataTypes and gives us the methods to perform the CRUD operations instead of us 
// manually writing the "SQL QUERIES and RELATIONS" on the data tables.

// Now, let the database connection through "SEQULELIZE" happen here which can be exported as a module where ever needed in the application.

// Importing the sequelize package in the application.
// const Sequelize = require('sequelize');

// // Instanctiating the sequelize class to configured it in the application.
// const sequelize = new Sequelize('online-pet-shop', 'root', 'swathiKumar@18', {
//     host: 'localhost',
//     dialect: 'mysql',
// });

// module.exports = sequelize;


// Now, Implementing the database connections with "MONGODB", so the old code which is created with "SEQUELIZE" is commented out.

const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://snadi043_db_user:ofa5A2r6E0OtnMSS@cluster0.ea85prw.mongodb.net/shop?appName=Cluster0')
    .then((client) => {
        _db = client.db();
        callback();
    }).catch(err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;