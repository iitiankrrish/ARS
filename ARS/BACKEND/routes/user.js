const express = require('express');
const { handleSignUp, handleLogIn, handleLogOut } = require('../controllers/user');
const router = express.Router();
router.post('/signup',handleSignUp);
router.post('/login',handleLogIn);
router.post('/logout',handleLogOut);
module.exports = router;