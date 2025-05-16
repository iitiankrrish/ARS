const express = require('express');
const {UserLoggedInOrNot} = require('../middlewares/authorisation');

const {joinGroup , createGroup} = require("../controllers/group");
const router = express.Router();
router.post("/create",UserLoggedInOrNot,createGroup)
router.post('/join/:groupId',UserLoggedInOrNot,joinGroup);
module.exports = router;