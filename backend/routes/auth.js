const express = require('express');
const router = express.Router();
const { login, logout, verifyToken } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to login route
router.post('/login', loginLimiter, login);

// Logout route
router.post('/logout', logout);

// Verify token route
router.get('/verify', verifyToken);

module.exports = router; 