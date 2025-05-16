const express = require('express');
const profileRouter = express.Router();
const {UserLoggedInOrNot} = require('../middlewares/authorisation');
const {showAnyProfile,showProfileOfAssignedStudents,getMyProfile} = require('../controllers/profile');
profileRouter.get("/user",UserLoggedInOrNot,getMyProfile);
profileRouter.get("/user/:idToGet" ,UserLoggedInOrNot, showAnyProfile);
profileRouter.get("/user/:assignmentId/:userId",UserLoggedInOrNot,showProfileOfAssignedStudents);
module.exports = profileRouter;