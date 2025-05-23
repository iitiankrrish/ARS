const express = require('express');
const router = express.Router();
const {roleVerifierForAdminAndForReviewer} = require("../middlewares/assignment");
const {UserLoggedInOrNot} = require("../middlewares/authorisation");
const {sendRequest , responseToRequest , giveReviewTheAssignmentAndNotAcceptIt , acceptTheAssignment , getReviewerForParticularAssignment ,getAssignmentForThatParticularReviewer} = require("../controllers/reviewer");
router.post("/request" , UserLoggedInOrNot , sendRequest);
router.post("/respond" , UserLoggedInOrNot , responseToRequest);
router.post("/giveReview/:studentId/:assignmentId" , UserLoggedInOrNot , roleVerifierForAdminAndForReviewer , giveReviewTheAssignmentAndNotAcceptIt);
router.post("/acceptAssignment/:studentId/:assignmentId" , UserLoggedInOrNot , roleVerifierForAdminAndForReviewer , acceptTheAssignment);
router.post("/getreviewer/:assignmentId" , UserLoggedInOrNot , getReviewerForParticularAssignment);
router.post("/getassignment" , UserLoggedInOrNot , getAssignmentForThatParticularReviewer);
module.exports = router;