const express = require('express');
const { handleSignup, handleLogin } = require('../controllers/authController');
const { render } = require('ejs');
const router = express.Router();

// signup controller
// root route is ++>> /auth
router.get('/', (req, res) => {
    res.render('signup');
});

router.get("/l", (req, res) => {
    res.render("login");
});
router.post('/signup',handleSignup);
router.post('/l/login',handleLogin);

module.exports = router;