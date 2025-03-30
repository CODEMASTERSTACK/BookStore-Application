const jwt = require('jsonwebtoken');

// check if user is logged in
// TODO: make this more secure later
module.exports = function(req, res, next) {
    // get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // check if no token
    if (!token) {
        console.log('No token found in request');
        return res.status(401).json({ msg: 'No token found' });
    }

    try {
        // verify token
        // TODO: move secret key to env file later
        const decoded = jwt.verify(token, 'mysecretkey123');
        req.user = decoded.user;
        console.log('User authenticated:', req.user.id);
        next();
    } catch (err) {
        console.log('Auth error:', err);
        // FIXED: was sending wrong error message before
        res.status(401).json({ msg: 'Invalid token' });
    }
};