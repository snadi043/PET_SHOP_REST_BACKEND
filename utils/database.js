// Importing the mysql package from the npm mysql package to confiugre it in the application and overcome the complex issues facing with
// fileSystems while reading and retriving the data from it. So, by using the database like MYSQL, the data can be handled more efficiently
// and systematically over scalable information.

// Importing mysql 
const mysql = require('mysql2');

// Configuring the database to create a pool of connection for every single request made to the server, so that the concept of promises in the
// mysql environment is used perfectly to handle multiple request asynchronously. 
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'online-pet-shop',
    password: 'swathiKumar@18'
});

// exporting this db object to reuse in all the required places of the application to create an individual connection for every indivdual request.
module.exports = pool.promise();