require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(403).json({
        status: 'error',
        message: 'No token was provided',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.log('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        status: 'error',
        message: 'Server configuration error',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
          error: err.message,
        });
      }
      if (!decoded || decoded.id) {
        return res.status(500).json({
          status: 'error',
          message: 'Invalid token structure',
        });
      }

      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    console.error('Authentication failed');
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      error: error.message,
    });
  }
};
