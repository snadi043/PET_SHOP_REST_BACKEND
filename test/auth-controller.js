// Installing and Importing the packages to test the controllers code in the node express application.
const sinon = require('sinon');
const expect = require('chai').expect;
const mongoose = require('mongoose');

// Importing the respective controllers and models to test the "database" accessibility flow.
const  authController = require('../controllers/auth/auth');
const User = require('../models/user');

// describe -> to bind the individual AuthController Login related test cases. 
describe('Auth Controller - Login', () => {
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
    it('should throw an error with statusCode 500 when the database is not accessible.', (done) => {
        // Creating the stub to replecate the "findOne" mongoose method.
        // --- By using the sinon, and stubs way of dealing with the databases and its methods a environment of unit testing is created.
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        // Creating a fake "req" Object to work with the expected test cases flow.
        const req = {
            body: {
                email: 'test@test.com',
                password: 'test@4321'
            }
        };

        // Testing the controller method "login" by accepting the "req" and sending the "response".
        authController.login(req, {}, () => {}).then(result => {
            // In this controller method the expectation is to have an error object and have a property with statusCode 500.
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done(); // here done(), is the method "mocha" identifies in order to run asynchronous code.
        });

        // Using the restore method to register the findOne method from "sinon" to function accurately.
        User.findOne.restore();
    });

    // Ususally, unit testing is more that sucifient to test the code as, if all the unit test cases are tested and scenarios are covered,
    // there is high possibility of your code to work as expected without introducing any bugs into the application.
    
    // But in some cases like when dealing with the databases, there might be conditions when a complete realtime databse testing flow is demanding.
    // In such cases, it is highly recommended to work on a testing database setup to get more relatistic outcomes from the testcases.
    it('should return a valid user status when a user is valid.', (done) => {
            const req = {
                userId: '69515953f0c94b35fa19e092',
            };
            const res = {
                statusCode: 500,
                userStatus: null,
                status: (code) => {
                    this.statusCode = code;
                    return this;
                },
                json: (data) => {
                    this.userStatus = data.status;
                }
            };
            authController.getUserStatus(req, res, () => {}).then(() => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal('I am new user.');
                done();
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