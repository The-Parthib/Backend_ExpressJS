const express = require('express');
const { handleSignup } = require('../controllers/authController');
const router = express.Router();

// signup controller
router.post('/signup',handleSignup);

module.exports = router;