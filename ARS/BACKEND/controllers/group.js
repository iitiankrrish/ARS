const Group = require("../models/group");
const User = require("../models/user");
const Assignment = require("../models/assignment");
async function joinGroup(req, res) {
  const { groupId } = req.params;
  const userId = req.user._id;
  const role = req.user.role;
  if (!groupId) {
    return res.status(400).json({ Error: "Group Id is required" });
  }
  try {
const group = await Group.findOne({groupId});
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    if (group.members.includes(userId)) {
      return res.status(400).json({ Error: "You are already in the group" });
    }
    group.members.push(userId);
    await group.save();
    res.status(200).json({ Success: "You are succesfully added to the Group" });
  } catch (err) {
    console.log(err);
    res.json({ Error: "You cannot be added to the group" });
  }
}
async function createGroup(req, res) {
  const { name, groupId, members, captainId } = req.body;
  const createdBy = req.user._id;
  if (!name) {
    return res.json({ Error: "name is a required field" });
  }
  if (!groupId) {
    return res.json({ Error: "Group ID is a required field" });
  }
  if (members && !Array.isArray(members)) {
    return res.json({ Error: "Members field must be an array" });
  }
  const allMembers = members ? [createdBy, ...members] : [createdBy]; // Add creator as the first member

  try {
    // Create a new group
const existingGroup = await Group.findOne({ groupId });
    if (existingGroup) {
      return res
        .status(400)
        .json({ Error: "Group ID already exists, please choose another one." });
    }
    const newGroup = new Group({
      groupName: name,
      groupId,
      createdBy,
      members: allMembers,
      captain: captainId,
    });

    // Save the group to the database
    await newGroup.save();
    res.status(201).json({ message: "Group created successfully." });
  } catch (err) {
    console.log(err);
    return res.json({ Error: "Error Occured" });
  }
}
async function makeCaptain(req, res) {
  const { groupId, email, phoneNumber, username, name } = req.body;

  try {
    const groupinfo = await Group.findById(groupId);
    if (!groupinfo) {
      return res.status(404).json({ error: "No group found with this id" });
    }
    const userinfo = await User.findOne({ email, phoneNumber, username, name });

    if (!userinfo) {
      return res.status(404).json({ error: "No user found with these details" });
    }

    const userid = userinfo._id.toString();
    const allmembers = groupinfo.members.map(m => m.toString());

    // Check if user is already in the group members
    const ispresent = allmembers.includes(userid);

    if (!ispresent) {
      groupinfo.members.push(userinfo._id);
    }

    groupinfo.captainId = userinfo._id;
    await groupinfo.save();

    return res.json({ message: "Successfully created the captain" });
  } catch (error) {
    console.error("Error in makeCaptain:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function findMyGroup(req, res) {
  const { userId } = req.params;
  const groupswithme = [];

  try {
    const groupAll = await Group.find({});
    for (const group of groupAll) {
      // Check if userId is in the group's members array
      if (
        group.members.some((member) => member.toString() === userId.toString())
      ) {
        groupswithme.push(group);
      }
    }
    return res.json(groupswithme);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getAllInfoAboutTheGroup(req, res) {
  const { groupId } = req.params;

  try {
    // Fetch basic group info
    const groupbasicinfo = await Group.findById(groupId);
    if (!groupbasicinfo) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Fetch all assignments
    const allassignments = await Assignment.find({});
    const myAssignments = [];

    // Filter assignments where groupId exists in groupSubmissionStatus
    for (const assignment of allassignments) {
      const allgroups = assignment.groupSubmissionStatus || [];
      for (const group of allgroups) {
        if (group.groupId.toString() === groupId.toString()) {
          myAssignments.push(assignment);
          break; // no need to check other groups for this assignment
        }
      }
    }

    // Send combined response
    return res.json({
      groupbasicinfo,
      myAssignments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function findMyGroupbygroupid(req,res){
  const {groupName,groupId} = req.params;
  const groups = await Group.findOne({groupName,groupId});
  return res.json(groups);
}
module.exports = { joinGroup, createGroup, makeCaptain, findMyGroup , getAllInfoAboutTheGroup , findMyGroupbygroupid};
