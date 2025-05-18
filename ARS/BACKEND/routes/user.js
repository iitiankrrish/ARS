const express = require('express');
const {UserLoggedInOrNot} = require('../middlewares/authorisation');
const { handleSignUp, handleLogIn, handleLogOut ,askForReview} = require('../controllers/user');
const router = express.Router();
router.post('/signup',handleSignUp);
router.post('/login',handleLogIn);
router.post('/logout',handleLogOut);
router.post('/reviewRequestToReviewer',UserLoggedInOrNot,askForReview);
module.exports = router;