const jwt = require('jsonwebtoken');
const User = require('../models/User');


//User Authentication Middleware
const protect = async (req, res, next) => {
 let token  = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
 console.log('DEBUG - Auth Middleware - Token received:', token ? 'Bearer ' + token.substring(0, 20) + '...' : 'NO TOKEN');
if(token){
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('DEBUG - Auth Middleware - Decoded token:', decoded);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('DEBUG - Auth Middleware - User found:', req.user?.email, 'Role:', req.user?.role);
        if(!req.user){
            res.status(401);
            throw new Error('Not authorized, user not found');
        }
        next();
    }catch(error){
        console.log(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
}
};

const admin = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };


