const express = require('express');
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authentication');

//Route to register
router.post('/register', register)

//Route to login
router.post('/login', login)

//Route for forgot password
router.post('/forgot-password',authenticate, forgotPassword)

//Route to reset password
router.post('/reset-password',authenticate, resetPassword)

//Route to logout
router.post('/logout', logout)

module.exports = router
