const Assignment = require("../models/assignment");
const User = require("../models/user");

async function getMyProfile(req, res) {
  try {
    const role = req.user.role;
    const basicUserInfo = req.user;
    const allAssignments = await Assignment.find({});

    let pendingAssignments = [];
    let reviewedAssignments = [];
    let acceptedAssignments = [];

    if (role === "reviewee") {
      // For Reviewees: Get assignments from membersStatus
      allAssignments.forEach((assignment) => {
        assignment.membersStatus.forEach((member) => {
          if (member.userId.toString() === req.user._id.toString()) {
            if (member.status === "pending")
              pendingAssignments.push(assignment);
            if (member.status === "submitted")
              reviewedAssignments.push(assignment);
            if (member.status === "accepted")
              acceptedAssignments.push(assignment);
          }
        });
      });
    } else if (role === "reviewer") {
      // For Reviewers: Get assignments from reviewersStatus
      allAssignments.forEach((assignment) => {
        assignment.reviewersStatus.forEach((reviewer) => {
          if (reviewer.userId.toString() === req.user._id.toString()) {
            if (reviewer.status === "pending")
              pendingAssignments.push(assignment);
            if (reviewer.status === "reviewed")
              reviewedAssignments.push(assignment);
            if (reviewer.status === "accepted")
              acceptedAssignments.push(assignment);
          }
        });
      });
    }

    const userInfoObject = {
      basicUserInfo,
      pendingAssignments,
      reviewedAssignments,
      acceptedAssignments,
    };

    return res.json(userInfoObject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function showAnyProfile(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const idToGet = req.params.id;
    const basicUserInfo = await User.findById(idToGet);
    if (!basicUserInfo) {
      return res.status(404).json({ error: "User not found" });
    }

    const allAssignments = await Assignment.find({});
    let pendingAssignments = [];
    let reviewedAssignments = [];
    let acceptedAssignments = [];

    allAssignments.forEach((assignment) => {
      assignment.membersStatus.forEach((member) => {
        if (member.userId.toString() === idToGet) {
          if (member.status === "pending") pendingAssignments.push(assignment);
          if (member.status === "submitted")
            reviewedAssignments.push(assignment);
          if (member.status === "accepted")
            acceptedAssignments.push(assignment);
        }
      });
    });

    const userInfoObject = {
      basicUserInfo,
      pendingAssignments,
      reviewedAssignments,
      acceptedAssignments,
    };

    return res.json(userInfoObject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function showProfileOfAssignedStudents(req, res) {
  try {
    const { assignmentId, userId } = req.params;
    const assignmentObject = await Assignment.findById(assignmentId);

    if (!assignmentObject) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const userInAssignment = assignmentObject.membersStatus.find(
      (e) => userId === e.userId.toString()
    );

    if (!userInAssignment) {
      return res
        .status(404)
        .json({ error: "No such user exists in this assignment" });
    }

    const basicUserInfo = await User.findById(userId);
    if (!basicUserInfo) {
      return res.status(404).json({ error: "User not found" });
    }

    const allAssignments = await Assignment.find({});
    let pendingAssignments = [];
    let reviewedAssignments = [];
    let acceptedAssignments = [];

    allAssignments.forEach((assignment) => {
      assignment.membersStatus.forEach((member) => {
        if (member.userId.toString() === userId) {
          if (member.status === "pending") pendingAssignments.push(assignment);
          if (member.status === "submitted")
            reviewedAssignments.push(assignment);
          if (member.status === "accepted")
            acceptedAssignments.push(assignment);
        }
      });
    });

    const userInfoObject = {
      basicUserInfo,
      pendingAssignments,
      reviewedAssignments,
      acceptedAssignments,
    };

    return res.json(userInfoObject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getMyProfile,
  showAnyProfile,
  showProfileOfAssignedStudents,
};
