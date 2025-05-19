const express = require("express");
const { UserLoggedInOrNot } = require("../middlewares/authorisation");
const {
  roleVerifierForAdminAndForReviewer,
} = require("../middlewares/assignment");
const {
  joinGroup,
  createGroup,
  makeCaptain,
  findMyGroup,
  getAllInfoAboutTheGroup,
  findMyGroupbygroupid
} = require("../controllers/group");

const router = express.Router();

// Create a group (admin or reviewer)
router.post(
  "/create",
  UserLoggedInOrNot,
  roleVerifierForAdminAndForReviewer,
  createGroup
);

// Make a captain
router.post(
  "/chooseCaptain",
  UserLoggedInOrNot,
  roleVerifierForAdminAndForReviewer,
  makeCaptain
);

// Join a group (any user)
router.post("/join/:groupId", UserLoggedInOrNot, joinGroup);

// Get all groups a user is part of
router.post("/mygroups/:userId", UserLoggedInOrNot, findMyGroup);

// Get all info about a specific group
router.post("/group/:groupId", UserLoggedInOrNot, getAllInfoAboutTheGroup);
router.post("/find/:groupId/:groupName", UserLoggedInOrNot, findMyGroupbygroupid);

module.exports = router;
