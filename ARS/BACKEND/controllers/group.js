const Group = require("../models/group");
async function joinGroup(req, res) {
  const { groupId } = req.params;
  const userId = req.user._id;
  const role = req.user.role;
  if (!groupId) {
    return res.status(400).json({ Error: "Group Id is required" });
  }
  try {
    const group = await Group.findOne({ groupId });
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
  const { name, groupId, members , captainId} = req.body;
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
      captain : captainId,
    });

    // Save the group to the database
    await newGroup.save();
    res.status(201).json({ message: "Group created successfully." });
  } catch (err) {
    console.log(err);
    return res.json({ Error: "Error Occured" });
  }
}
module.exports = { joinGroup, createGroup };
