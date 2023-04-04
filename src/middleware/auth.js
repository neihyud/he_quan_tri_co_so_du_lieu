const jwt = require('jsonwebtoken');
const config = require('../config/index')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader.split(' ')[1]

    // Unauthorized
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not log in' })
    }

    // 403: Forbidden
    try {
        const decoded = jwt.verify(token, config.accessTokenSecret)

        req.userId = decoded.userId

        next()
    } catch (error) {
        console.log(error);
        return res.status(403).json({ success: false, message: 'Invalid token' })
    }
}

module.exports = verifyToken;