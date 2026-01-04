// Installing and Importing the packages to test the controllers code in the node express application.
const expect = require('chai').expect;
const mongoose = require('mongoose');

// Importing the respective controllers and models to test the "database" accessibility flow.
const feedController = require('../controllers/feed/feed');
const User = require('../models/user');

// describe -> to bind the individual AuthController Login related test cases. 
describe('Feed Controller - CreatePost', () => {
    // before() -> It is a lifecycle hook provided by "mocha" to write more cleaner code and "before" helps to setup the code where something has to be
    // triggered once before any other testcases run defined in the "it" statements.
    // For example, setting up a database connection would be one of the best examples where before() can be used.
    before((done) => {
        // connecting to the mongodb with mongoose library.
        mongoose.connect('mongodb+srv://snadi043_db_user:ofa5A2r6E0OtnMSS@cluster0.ea85prw.mongodb.net/online-shop-test?appName=Cluster0')
        .then(result => {
            const user = new User({
                email: 'test@test.com',
                password: 'test4321',
                name: 'sai',
                posts: [],
                _id: '69515953f0c94b35fa19e092'
            });
            return user.save();
        }).then(() => {
            done();
        });
    }); 
    // done() -> It is used when dealing with asynchronous code in the controllers, so that mocha identifies it and waits for the code to get
    // executed and function accordingly as expected.
    it('should add post to the creator posts when createPost middleware is triggered in the application.', (done) => {

        // Creating a fake "req" Object to work with the expected test cases flow.
        const req = {
            body: {
                title: 'Test Post Title',
                content: 'Test Post Content'
            },
            file: {
                path: 'abc',
            },
            userId: '69515953f0c94b35fa19e092'
        };

        const res = {
            status: () => {
                return this;
            },
            json: () => {

            }
        };

        // Testing the controller method "login" by accepting the "req" and sending the "response".
        feedController.createPost(req, res, () => {}).then(savedUser => {
            // In this controller method the expectation is to have an error object and have a property with statusCode 500.
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done(); // here done(), is the method "mocha" identifies in order to run asynchronous code.
        }).catch((err) => {
            done(err);
        });
    });

    after((done) => {
    // Also, it is important that before disconnecting the database it is also important to remove the exisiting user
    // from the database because the same userId which is hardcoded in the test case can throw errors for the next test case.
    User.deleteMany({}).then(() => {
        return mongoose.disconnect();
    }).then(() => {
        // Disconnecting the database after the expectations are meet so that the code works fine for the next test case
        // without throwing errors.
        done();
        });
    });
});