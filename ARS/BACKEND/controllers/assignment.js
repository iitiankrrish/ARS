const Assignment = require("../models/assignment");
const Subtask = require("../models/subtask");
const Group = require("../models/group");
const User = require("../models/user");
const Reviewer = require("../models/reviewer");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
// const mongoose = require("mongoose");

async function createAssignment(req, res) {
  const {
    title,
    description,
    assignedToGroup,
    assignedToUser,
    dueDate,
    subtask,
  } = req.body;

  const createdBy = req.user._id;

  if (
    (!assignedToGroup || assignedToGroup.length === 0) &&
    (!assignedToUser || assignedToUser.length === 0)
  ) {
    return res.status(400).json({
      Error: "You need to assign the assignment to at least one group or user",
    });
  }

  if (!title || !description || !dueDate) {
    return res.status(400).json({
      Error: "Title, description, and due date are required",
    });
  }

  try {
    const existingAssignment = await Assignment.findOne({ title, description });

    if (existingAssignment) {
      return res.json({
        Error:
          "Exactly same assignment already exists. You can add members to it but not create it again. To create it, please delete the existing one.",
      });
    }

    // Create subtasks
    const arrayOfSubtaskId = [];
    if (Array.isArray(subtask)) {
      for (const subtaskObject of subtask) {
        const { title, description } = subtaskObject;
        const savedSubtask = await Subtask.create({
          title,
          description,
          dueDate,
        });
        arrayOfSubtaskId.push(savedSubtask._id);
      }
    }

    const assignedDate = Date.now();
    const membersStatus = [];
    const groupSubmissionStatus = [];

    // Handle multiple users (can be single ID or array)
    const userArray = Array.isArray(assignedToUser)
      ? assignedToUser
      : [assignedToUser];
    for (const userId of userArray.filter(Boolean)) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ Error: `Invalid User ID: ${userId}` });
      }

      const student = await User.findById(userId);
      if (!student) {
        return res.status(404).json({ Error: `User not found: ${userId}` });
      }

      if (student.role !== "reviewee") {
        return res
          .status(400)
          .json({
            Error: `User ${student.name || student._id} is not a reviewee`,
          });
      }

      membersStatus.push({
        userId: student._id,
        status: "pending",
        reviews: [],
      });
    }

    // Handle multiple groups (can be single ID or array)
    const groupArray = Array.isArray(assignedToGroup)
      ? assignedToGroup
      : [assignedToGroup];
    for (const groupId of groupArray.filter(Boolean)) {
      if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ Error: `Invalid Group ID: ${groupId}` });
      }

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: `Group not found: ${groupId}` });
      }

      groupSubmissionStatus.push({
        groupId: group._id,
        status: "pending",
        reviews: [],
      });
    }

    // Create the assignment
    const newAssignment = await Assignment.create({
      title,
      description,
      assignedToGroup: groupArray.length > 0 ? groupArray : undefined,
      assignedToUser: userArray.length > 0 ? userArray : undefined,
      assignedDate,
      dueDate,
      membersStatus,
      groupSubmissionStatus,
      status: "assigned",
      createdBy,
      subtask: arrayOfSubtaskId,
    });

    // Update each subtask with the assignmentId
    const assignmentId = newAssignment._id;
    for (const id of arrayOfSubtaskId) {
      await Subtask.findByIdAndUpdate(id, { assignmentId });
    }

    // Create reviewer record
    await Reviewer.create({
      assignment: assignmentId,
      reviewers: [
        {
          userId: createdBy,
          addedStatus: "Accepted",
        },
      ],
    });

    return res.status(201).json({ message: "Assignment created successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ Error: "Failed to create assignment", details: err.message });
  }
}

async function submissionOfAssignment(req, res) {
  const userId = req.user._id;
  const role = req.user.role;

  // Ensure only reviewees can submit the assignment
  if (role !== "reviewee") {
    return res.json({ Error: "Only reviewee can submit the assignment" });
  }
  const { comment, iterationNumber } = req.body;
  const { assignmentId } = req.params;

  try {
    // Await the result of the findOne operation
    const assignment = await Assignment.findOne({ _id: assignmentId });
    if (!assignment) {
      return res.json({ Error: "No such assignment exists" });
    }
    const memberStatus = assignment.membersStatus.find(
      (member) => member.userId.toString() === userId.toString()
    );

    if (!memberStatus) {
      return res.json({
        Error:
          "No such member exists either in group or individually who has been assigned this assignment",
      });
    }
    if (assignment.dueDate < Date.now()) {
      return res.json("You cannot submit after the due date");
    }

    // Check if all subtasks are completed , har ek subtask ko lo and uske respective id mein jaake check if it is completed
    const subtaskDocs = await Subtask.find({
      _id: { $in: assignment.subtask },
    });

    const allSubtasksCompleted = subtaskDocs.every((subtask) => {
      const userSubmission = subtask.submissions.find(
        (s) => s.userId.toString() === userId.toString()
      );
      return userSubmission && userSubmission.status === "submitted";
    });
    if (!allSubtasksCompleted) {
      return res.json({
        Message:
          "In order to submit this task, you have to complete all subtasks",
      });
    }
    // let filesData = [];
    // if (req.files && req.files.length > 0) {
    //   filesData = req.files.map((file) => ({
    //     filePath: file.path, // Path where the file is stored (from multer)
    //     fileName: file.originalname, // Original file name
    //   }));
    // }
    // assignment.userAttachments.push(...filesData);

    // Ensure membersStatus exists and is an array

    if (memberStatus.status == "submitted") {
      console.log("bitch");
      return res.json({
        Message: `Cannot submit because the assignment is ${memberStatus.status}`,
      });
    }
    console.log(memberStatus);
    // Update the status of the user to "submitted"
    memberStatus.status = "submitted";
    memberStatus.revieweeComments = [
      ...(memberStatus.revieweeComments || []),
      { comment, iterationNumber },
    ];
    console.log(memberStatus.revieweeComments);
    console.log(memberStatus);

    memberStatus.submittedAt = Date.now();
    assignment.markModified("membersStatus");
    await assignment.save(); // Save the assignment after the update

    res.status(200).json({ message: "Assignment submitted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function sendAssignment(req, res) {
  const { assignmentId } = req.params;
  const { emailIds, userPassword } = req.body;
  const userEmailId = req.user.email;

  // Check if the assignment exists
  const assignmentExists = await Assignment.findOne({ _id: assignmentId });
  if (!assignmentExists) {
    return res.json({ Error: "No Such Assignment Exists" });
  }

  // Check if emailIds are provided
  if (!emailIds) {
    return res.json({ Error: "Email ids need to be specified" });
  }

  // Check if user email is available
  if (!userEmailId) {
    return res.json({ Error: "No email id of the user" });
  }

  try {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmailId,
        pass: userPassword, // The app-password to authenticate the sender's email
      },
    });

    // Process the email IDs
    const allEmails = emailIds.split(",").map((e) => e.trim());

    // Set up mail options
    const mailOptions = {
      from: userEmailId,
      to: userEmailId, // Send the email to the sender
      bcc: allEmails.join(","), // BCC to all email recipients
      subject: `Assignment Shared: ${assignmentExists.title}`,
      text: `You have been shared an assignment:\n\nAssignment: ${assignmentExists.title}\nDescription: ${assignmentExists.description}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send response to client
    return res.status(200).json({ message: "Assignment shared successfully" });
  } catch (err) {
    // Handle error
    console.error(err);
    return res
      .status(500)
      .json({ Error: "Failed to send email", details: err.message });
  }
}
// async function assignmentUnsubmission(req, res) {
//   const { assignmentId } = req.params;
//   const userId = req.user._id;

//   try {
//     // Find the assignment
//     const assignment = await Assignment.findById(assignmentId);

//     if (!assignment) {
//       return res.status(404).json({ error: "Assignment not found" });
//     }

//     // Find the student in the membersStatus array
//     const student = assignment.membersStatus.find(
//       (member) => member.userId.toString() === userId.toString()
//     );

//     // Check if the student is found and their status is "submitted"
//     if (!student) {
//       return res
//         .status(404)
//         .json({ error: "Student not found in this assignment" });
//     }

//     if (student.status === "submitted") {
//       student.status = "pending"; // Change the status to "pending"
//     }

//     // Save the assignment after updating the student's status
//     await assignment.save();

//     // Send success response
//     res.status(200).json({ message: "Assignment unsubmitted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }
async function addUserToExistingAssignment(req, res) {
  try {
    const { userId , assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ Error: "Assignment not found" });
    }
    let membersStatus = assignment.membersStatus;
    // Adding a single user
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ Error: "Invalid User ID" });
      }

      
      // console.log(membersStatus);
      // Check if the user is already in membersStatus
      // const isAlreadyAdded = membersStatus.some(
      //   (status) => status._id.toString() === assignedToUser.toString()
      // );
      const isAlreadyAddedAlso = membersStatus.some(
        (status) =>
          status.userId &&
          status.userId.toString() === userId?.toString()
      );

      if (!isAlreadyAddedAlso) {
        membersStatus.push({
          userId: userId,
          status: "pending",
          reviews: [],
        });
      }
    }

  
    // Save updated assignment
    assignment.membersStatus = membersStatus;
    await assignment.save();
    
    return res.status(200).json({ message: "Assignment updated successfully" });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
}
async function addGroupToExistingAssignment(req, res){
 try {
    const { userId , groupId , assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ Error: "Assignment not found" });
    }
    let groupSubmissionStatus = assignment.groupSubmissionStatus;
    // Adding a single user
    if (groupId) {
      if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ Error: "Invalid Group ID" });
      }
      const group = await Group.findById(groupId);
      if(group.captainId.toString() !== userId.toString()){
        return res.json({"error":"only captains can make the group join the assignment"});
      }
      // console.log(membersStatus);
      // Check if the user is already in membersStatus
      // const isAlreadyAdded = membersStatus.some(
      //   (status) => status._id.toString() === assignedToUser.toString()
      // );
      const isAlreadyAddedAlso = groupSubmissionStatus.some(
        (status) =>
          status.groupId &&
          status.groupId.toString() === groupId?.toString()
      );

      if (!isAlreadyAddedAlso) {
        groupSubmissionStatus.push({
          groupId: groupId,
          status: "pending",
          reviews: [],
        });
      }
    }

  
    // Save updated assignment
    assignment.groupSubmissionStatus = groupSubmissionStatus;
    await assignment.save();
    
    return res.status(200).json({ message: "Assignment updated successfully" });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
}
async function removeAssignment(req, res) {
  try {
    const { assignmentId } = req.params;
    const role = req.user.role;
    if (role === "reviewee") {
      return res
        .status(403)
        .json({ error: "Reviewees can't remove assignments" });
    }

    // Use `findByIdAndDelete` to reduce DB queries
    const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);

    if (!deletedAssignment) {
      return res.status(404).json({ error: "No such assignment exists" });
    }

    return res.status(200).json({ success: "Removed the assignment" });
  } catch (error) {
    console.error("Error removing assignment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function groupSubmissionOfAssignment(req, res) {
  const captainId = req.user._id;
  const role = req.user.role;
  // const { comment, iterationNumber } = req.body;
  const { groupId, comment, iterationNumber } = req.body;
  // Ensure only reviewees can submit the assignment
  if (role !== "reviewee") {
    return res.json({ Error: "Only reviewee can submit the assignment" });
  }

  const { assignmentId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (group.captainId.toString() !== captainId.toString()) {
      return res.json({
        Error:
          "You cannot submit this assignment as you are not the captain of the group",
      });
    }
    const assignment = await Assignment.findOne({ _id: assignmentId });
    if (!assignment) {
      return res.json({ Error: "No such assignment exists" });
    }
    if (assignment.subtask.length > 0) {
      const subtaskDocs = await Subtask.find({
        _id: { $in: assignment.subtask },
      });
      const allSubtasksCompleted = subtaskDocs.every((subtask) => {
        const groupSubmission = subtask.groupSubmissions.find(
          (g) => g.groupId.toString() === groupId.toString()
        );
        return groupSubmission && groupSubmission.status === "submitted";
      });

      if (!allSubtasksCompleted) {
        return res.json({
          Message:
            "In order to submit this task, you have to complete all subtasks",
        });
      }
    }
    // let filesData = [];
    // if (req.files && req.files.length > 0) {
    //   filesData = req.files.map((file) => ({
    //     filePath: file.path, // Path where the file is stored (from multer)
    //     fileName: file.originalname, // Original file name
    //   }));
    // }
    // assignment.userAttachments.push(...filesData);

    // Ensure membersStatus exists and is an array
    const groupSubmissionStatus = assignment.groupSubmissionStatus.find(
      (group) => group.groupId.toString() === groupId.toString()
    );

    if (!groupSubmissionStatus) {
      return res.json({
        Error: "No such group exists",
      });
    }
    if (groupSubmissionStatus.status == "submitted") {
      return res.json({
        Message: `Cannot submit because the assignment is ${memberStatus.status}`,
      });
    }

    // Update the status of the user to "submitted"
    groupSubmissionStatus.revieweeComments = [
      ...(groupSubmissionStatus.revieweeComments || []),
      { comment, iterationNumber },
    ];
    groupSubmissionStatus.status = "submitted";
    groupSubmissionStatus.submittedAt = Date.now();
    assignment.markModified("groupSubmissionStatus");
    await assignment.save(); // Save the assignment after the update

    res.status(200).json({ message: "Assignment submitted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getpendingassignments(req, res) {
  const { studentId } = req.params;

  try {
    const allAssignments = await Assignment.find({}); // lean = better perf

    const pendingAssignments = [];

    allAssignments.forEach((assignment) => {
      const matchingMember = assignment.membersStatus.find(
        (member) =>
          member.userId.toString() === studentId.toString() &&
          member.status === "pending"
      );

      if (matchingMember) {
        pendingAssignments.push({
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
          title: assignment.title,

          id: assignment._id,

          status: matchingMember.status,
        });
      }
    });

    return res.json(pendingAssignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getallassignments(req, res) {
  const { studentId } = req.params;

  const allmyassignmentobject = [];

  try {
    const allAssignments = await Assignment.find({});

    allAssignments.forEach((assignment) => {
      const memberstatus = assignment.membersStatus;

      for (const member of memberstatus) {
        if (member.userId.toString() === studentId.toString()) {
          allmyassignmentobject.push({
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate,
            id: assignment._id,
            status: member.status,
          });
        }
      }
    });

    return res.json(allmyassignmentobject);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getreviewedassignments(req, res) {
  const { studentId } = req.params;

  try {
    const allAssignments = await Assignment.find({}).lean(); // lean = better perf

    const pendingAssignments = [];

    allAssignments.forEach((assignment) => {
      const matchingMember = assignment.membersStatus.find(
        (member) =>
          member.userId.toString() === studentId.toString() &&
          member.status === "submitted"
      );

      if (matchingMember) {
        pendingAssignments.push({
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
          id: assignment._id,
          status: matchingMember.status,
        });
      }
    });

    return res.json(pendingAssignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getacceptedassignments(req, res) {
  const { studentId } = req.params;

  try {
    const allAssignments = await Assignment.find({}).lean(); // lean = better perf

    const pendingAssignments = [];

    allAssignments.forEach((assignment) => {
      const matchingMember = assignment.membersStatus.find(
        (member) =>
          member.userId.toString() === studentId.toString() &&
          member.status === "accepted"
      );

      if (matchingMember) {
        pendingAssignments.push({
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
          id: assignment._id,
          status: matchingMember.status,
        });
      }
    });

    return res.json(pendingAssignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getselectedassignmentinfo(req, res) {
  try {
    const { id } = req.params;

    const allAssignments = await Assignment.find({});

    for (const assignment of allAssignments) {
      if (assignment._id.toString() === id.toString()) {
        return res.json(assignment);
      }
    }
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
}
async function getUserComments(req, res) {
  const { assignmentId, studentId } = req.params;

  try {
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Find the member entry for the student
    const member = assignment.membersStatus.find(
      (m) => m.userId.toString() === studentId
    );

    if (!member) {
      return res
        .status(404)
        .json({ message: "Student not found in membersStatus" });
    }

    // Get non-empty comments
    const nonEmptyComments = (member.revieweeComments || []).filter(
      (commentObj) =>
        commentObj &&
        typeof commentObj.comment === "string" &&
        commentObj.comment.trim() !== ""
    );
    const comments = nonEmptyComments.map((commentObj) => commentObj.comment);

    return res.json(comments);
  } catch (error) {
    console.error("Error in getUserComments:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
async function getAssignmentStatusForThatUser(req, res) {
  const { assignmentId, studentId } = req.params;

  try {
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Find the member entry for the student
    const member = assignment.membersStatus.find(
      (m) => m.userId.toString() === studentId
    );

    if (!member) {
      return res
        .status(404)
        .json({ message: "Student not found in membersStatus" });
    }

    return res.json(member.status);
  } catch (error) {
    console.error("Error in getUserComments:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createAssignment,
  submissionOfAssignment,
  sendAssignment,
  // assignmentUnsubmission,
  addUserToExistingAssignment,
  removeAssignment,
  groupSubmissionOfAssignment,
  getpendingassignments,
  getacceptedassignments,
  getreviewedassignments,
  getallassignments,
  getselectedassignmentinfo,
  getUserComments,
  getAssignmentStatusForThatUser,
  addGroupToExistingAssignment
};
