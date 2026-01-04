// const expect = require('chai').expect;

// // MOCHA is the testing framework which gives the accessibility to all the testing methods so that every case in the application
// // can be desgined to be tested with the code written.

// // CHAI is also a testing framework which understands the testing conditions written in the form of code and responds with the
// // correct desitions such that manual errors are not overlooked. 
// it('Testing the addition of two numbers', function(){
//     const num1 = 2;
//     const num2 = 4;
//     expect(num1 + num2).to.equal(6);
// });

const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/isAuth');

const expect = require('chai').expect;

// Sinon is another important testing package which deals with registering the third-party methods which are usually not the scope of developers to 
// test the packages build-in methods when they are being used, but, the dependent flow after these methods which might have a blockers such that the next steps 
// which can be in the scope of actual testing conditions cannot be tested. So, in such cases, the sinon package gives the flexibility to actually register the 
// third party methods and work with them in the code. 
const sinon = require('sinon');

// describe is a method provided by mocha to bundle all the related individual testcases of an feature/controller etc, so it
// is easy to identify in the logs and relate to which bundle that the test is stemming from.
describe('AuthMiddleware', () => {
    it('Throw an error when a authorization header is not set/found when accessing the API', () => {
        // Creating a dummmy "req" object so that the middleware function is treated similarly as th code written in the middleware "isAuth" file.
        const req = {
            get: () => {
                return null;
            } 
        };
        // bind() method is used so that the authMiddleware is triggered by the testing frameworks "MOCHA" & "CHAI" instead of the manual
        // trigger of passing the "authMiddleware" function directly to the "expect" method.
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Authorization Failed.');
    });
    
    it('Throw an error when a token is returned without splitting from the {key,value} and returing the entire object.', () => {
        const req = {
            get: () => {
                return 'xyz';
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('Throw an error when a token is not verified by the verify method provided by the "jsonWebToken" package.', () => {
        const req = {
            get: () => {
                return 'Bearer xyz';
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('Attach the userId value once the token is verified to the user object.', () => {
        const req = {
            get: () => {
                return 'Bearer xyzxyxxyxzz';
            },
        }
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({userId: 'abc'});
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });
});

