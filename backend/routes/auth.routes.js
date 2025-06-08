const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getMe);

// /forget password, /reset password, /logout

module.exports = router;
