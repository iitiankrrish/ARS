const Assignment = require("../models/assignment");
const Subtask = require("../models/subtask");
const Group = require("../models/group");
const User = require("../models/user");
const Reviewer = require("../models/reviewer");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
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
  // Check if either assignedToGroup or assignedToUser is provided
  if (!assignedToGroup && !assignedToUser) {
    return res
      .status(400)
      .json({ Error: "You need to assign the assignment to someone" });
  }

  // Validate other required fields (e.g., title, description, dueDate)
  if (!title || !description || !dueDate) {
    return res
      .status(400)
      .json({ Error: "Title, description, and due date are required" });
  }

  try {
    const existingAssignment = await Assignment.findOne({
      title: title,
      description: description,
    });

    if (existingAssignment) {
      return res.json({
        Error:
          "Exactly same assignment already exists, you can add members to it but not create it again ... to create it ... delete it",
      });
    }
    //Create subtasks
    const arrayOfSubtaskId = [];
    if (Array.isArray(subtask)) {
      for (const subtaskObject of subtask) {
        const { title, description } = subtaskObject;
        const schemaStorage = await Subtask.create({
          title,
          description,
          dueDate,
        });
        arrayOfSubtaskId.push(schemaStorage._id);
      }
    }
    // Set the assigned date to the current time
    const assignedDate = Date.now();
    let membersStatus = [];
    if (assignedToUser) {
      if (!mongoose.Types.ObjectId.isValid(assignedToUser)) {
        return res.status(400).json({ Error: "Invalid User ID" });
      }

      const studentObject = await User.findById(assignedToUser); // More optimized than findOne

      if (!studentObject) {
        return res.status(404).json({ Error: "User not found" });
      }

      if (studentObject.role !== "reviewee") {
        return res.status(400).json({
          Error: "You tried to assign an assignment to a reviewer or admin",
        });
      }
      membersStatus.push({
        userId: assignedToUser,
        status: "pending",
        reviews: [],
      });
    }

    if (assignedToGroup) {
      if (!mongoose.Types.ObjectId.isValid(assignedToGroup)) {
        return res.status(400).json({ Error: "Invalid Group ID" });
      }
      // Group assignment
      const group = await Group.findById(assignedToGroup);

      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }

      // Add all members of the group with 'pending' status
      for (const member of group.members) {
        // Check if the user is already in membersStatus
        const isAlreadyAdded = membersStatus.some(
          (status) =>
            status.userId && status.userId.toString() === member?.toString()
        );

        if (!isAlreadyAdded) {
          // Fetch user role to check if they are a reviewee
          const user = await User.findById(member);

          if (user && user.role === "reviewee") {
            membersStatus.push({
              userId: member,
              status: "pending",
              reviews: [],
            });
          }
        }
      }
    }
    // let filesData = [];
    // if (req.files && req.files.length > 0) {
    //   filesData = req.files.map((file) => ({
    //     filePath: file.path, // Path where the file is stored (from multer)
    //     fileName: file.originalname, // Original file name
    //   }));
    // }
    // Create the assignment document
    const newAssignment = await Assignment.create({
      title,
      description,
      assignedToGroup,
      assignedToUser,
      assignedDate,
      dueDate,
      membersStatus,
      status: "assigned",
      createdBy,
      subtask: arrayOfSubtaskId, //stored as arrays of id of subtask
      // reviewerAttachments: filesData,
    });

    const assignmentId = newAssignment._id;
    for (const id of arrayOfSubtaskId) {
      await Subtask.findByIdAndUpdate(id, { assignmentId });
    }
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
    // Return error response with proper status code
    console.error(err); // Log the error for debugging
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
      return res.json({
        Message: `Cannot submit because the assignment is ${memberStatus.status}`,
      });
    }

    // Update the status of the user to "submitted"
    memberStatus.status = "submitted";
    memberStatus.submittedAt = Date.now();
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
async function assignmentUnsubmission(req, res) {
  const { assignmentId } = req.params;
  const userId = req.user._id;

  try {
    // Find the assignment
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Find the student in the membersStatus array
    const student = assignment.membersStatus.find(
      (member) => member.userId.toString() === userId.toString()
    );

    // Check if the student is found and their status is "submitted"
    if (!student) {
      return res
        .status(404)
        .json({ error: "Student not found in this assignment" });
    }

    if (student.status === "submitted") {
      student.status = "pending"; // Change the status to "pending"
    }

    // Save the assignment after updating the student's status
    await assignment.save();

    // Send success response
    res.status(200).json({ message: "Assignment unsubmitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function addUserOrGroupToExistingAssignment(req, res) {
  try {
    const { assignmentId } = req.params;
    const { assignedToUser, assignedToGroup } = req.body;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ Error: "Invalid Assignment ID" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ Error: "Assignment not found" });
    }

    let membersStatus = assignment.membersStatus;

    // Adding a single user
    if (assignedToUser) {
      if (!mongoose.Types.ObjectId.isValid(assignedToUser)) {
        return res.status(400).json({ Error: "Invalid User ID" });
      }

      const studentObject = await User.findById(assignedToUser);
      if (!studentObject) {
        return res.status(404).json({ Error: "User not found" });
      }

      if (studentObject.role !== "reviewee") {
        return res
          .status(400)
          .json({ Error: "Cannot assign to a reviewer or admin" });
      }
      // console.log(membersStatus);
      // Check if the user is already in membersStatus
      // const isAlreadyAdded = membersStatus.some(
      //   (status) => status._id.toString() === assignedToUser.toString()
      // );
      const isAlreadyAddedAlso = membersStatus.some(
        (status) =>
          status.userId &&
          status.userId.toString() === assignedToUser?.toString()
      );

      if (!isAlreadyAddedAlso) {
        membersStatus.push({
          userId: assignedToUser,
          status: "pending",
          reviews: [],
        });
      }
    }

    // Adding a group
    if (assignedToGroup) {
      if (!mongoose.Types.ObjectId.isValid(assignedToGroup)) {
        return res.status(400).json({ Error: "Invalid Group ID" });
      }

      const group = await Group.findById(assignedToGroup);
      if (!group) {
        return res.status(404).json({ Error: "Group not found." });
      }

      for (const member of group.members) {
        // Check if the user is already in membersStatus
        const isAlreadyAddedAlso = membersStatus.some(
          (status) =>
            status.userId && status.userId.toString() === member?.toString()
        );

        if (!isAlreadyAddedAlso) {
          const user = await User.findById(member);
          if (user && user.role === "reviewee") {
            membersStatus.push({
              userId: member,
              status: "pending",
              reviews: [],
            });
          }
        }
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
  const { groupId } = req.body;
  // Ensure only reviewees can submit the assignment
  if (role !== "reviewee") {
    return res.json({ Error: "Only reviewee can submit the assignment" });
  }

  const { assignmentId } = req.params;

  try {
    const Group = await Group.findById(groupId);
    if (Group.captainId.toString() !== captainId.toString()) {
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
    groupSubmissionStatus.status = "submitted";
    groupSubmissionStatus.submittedAt = Date.now();
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
        (member) => member.userId.toString() === studentId.toString() && member.status === "pending"
      );

      if (matchingMember) {
        pendingAssignments.push({
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
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
        if ( member.userId.toString() === studentId.toString()) {
          allmyassignmentobject.push({
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate,
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
        (member) =>  member.userId.toString() === studentId.toString() && member.status === "submitted"
      );

      if (matchingMember) {
        pendingAssignments.push({
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
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
        (member) =>  member.userId.toString() === studentId.toString() && member.status === "accepted"
      );

      if (matchingMember) {
        pendingAssignments.push({
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
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

module.exports = {
  createAssignment,
  submissionOfAssignment,
  sendAssignment,
  assignmentUnsubmission,
  addUserOrGroupToExistingAssignment,
  removeAssignment,
  groupSubmissionOfAssignment,
  getpendingassignments,
  getacceptedassignments,
  getreviewedassignments,
  getallassignments
};
