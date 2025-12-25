const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authorizationHeader = req.get('Authorization');
    if(!authorizationHeader){
        const error = new Error('Unable to find Authorization Header');
        error.statusCode = 401;
        throw error;
    }
    const token = authorizationHeader.split(' ')[1];
    let decodedToken; 
    try{
        decodedToken = jwt.verify(token, 'supersecretfortheapplication');
    }
    catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Unable to verify the token');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}