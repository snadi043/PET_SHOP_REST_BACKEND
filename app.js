const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const path = require('path');

const multer = require('multer');

const cors = require('cors');

const grahpqlResolver = require('./graphql/resolvers');
const grahpqlSchema = require('./graphql/schema');

const { graphqlHTTP } = require('express-graphql');

// const feedRoutes = require('./routes/feed');
// const authRoutes = require('./routes/auth');

const DB_URL = 'mongodb+srv://snadi043_db_user:ofa5A2r6E0OtnMSS@cluster0.ea85prw.mongodb.net/shop_posts?appName=Cluster0';

const app = express();

app.use(cors());

app.use(bodyParser.json());

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, '/public/images');
    },
    filename: function(req, file, cb) {
        const file_name_extension = Date.now() + '_' + Math.round(Math.random());
        cb(null, file.fieldname + '_' + file_name_extension);
    }
});

app.use(multer({
    fileFilter: fileFilter,
    storage: fileStorage
}).single('image'));

app.use('/public/images', express.static(path.join(__dirname, 'images')));

// app.use('/auth', authRoutes);
// app.use('/feed', feedRoutes);

app.use(graphqlHTTP({
    schema: grahpqlSchema,
    rootValue: grahpqlResolver,
    graphiql: true
}));

// This is the middleware function to catch the global errors in the application and returns custom error statusCode and error message.
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message, data: error.data});
});

mongoose.connect(DB_URL)
    .then(result => {
        console.log('DATABASE CONNECTED.');
        app.listen(8080);
    })
    .catch(err => {console.log('DATABASE ERROR', err)});
