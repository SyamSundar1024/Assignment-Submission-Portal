const jwt = require('jsonwebtoken');

//Middleware function:
const authenticateUser = (req, res, next) => {                                      
    const token = req.header('x-auth-token');                                         //Retrieving token from request header.
    if(!token) return res.status(401).json({msg: 'No token, authorization denied'});  //checks if token is present in request header, if it is not there returns an error.

    try{
        const decoded = jwt.verify(token, 'your_jwt_secret');                         //Checking if the token is valid.
        req.user = decoded.user;
        next();
    }
    catch(err){                                                                         //If the token is not valid, returns an error.
        res.status(401).json({msg: 'Invalid token'});
    }
};

module.exports = {authenticateUser};