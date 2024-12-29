const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const userId = decodedToken.userId;
        req.auth = { userId }; // Store the userId in the request object
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized request' });
    }
};
