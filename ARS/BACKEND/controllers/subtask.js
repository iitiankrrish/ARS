const Assignment = require("../models/assignment");
const Group = require("../models/group");
const Subtask = require("../models/subtask");
//REFACTOR TO ADD A FEATURE OF UNSUBMISSION AS WELL
// Function to handle the submission of a subtask
async function submitSubtask(req, res) {
  const { subtaskId } = req.params;
  const userId = req.user._id;

  try {
    // Find the subtask by its ID
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.json({ Error: "No such subtask exists" });
    }

    if (subtask.dueDate < Date.now()) {
      return res.json("You cannot submit after the due date");
    }
    // Get the assignment associated with the subtask
    const assignmentId = subtask.assignmentId;
    const assignment = await Assignment.findById(assignmentId);

    // Check if the user is part of the assignment
    const assignedUser = assignment.membersStatus.find(
      (member) => member.userId.toString() === userId.toString()
    );
    if (!assignedUser) {
      return res.json({ Error: "You are not part of this assignment" });
    }
    // Check if the subtask has already been submitted by this user
    const existingSubmission = subtask.submissions.find(
      (submission) => submission.userId.toString() === userId.toString()
    );

    if (existingSubmission && existingSubmission.status === "submitted") {
      return res.json({ Error: "You have already submitted this subtask" });
    }

    // let filesData = [];
    // if (req.files && req.files.length > 0) {
    //   filesData = req.files.map(file => ({
    //     filePath: file.path,
    //     fileName: file.originalname,
    //   }));
    // }

    // Add the file attachment to the user's submission
    if (!existingSubmission) {
      subtask.submissions.push({
        userId,
        status: "submitted",
        // userAttachments: filesData,
      });
    } else {
      existingSubmission.status = "submitted";
      // existingSubmission.userAttachments.push(...filesData);
    }

    // Mark the subtask as submitted and update the submission time
    subtask.status = "submitted";
    subtask.submittedAt = new Date();
    await subtask.save();

    // Check if all subtasks are submitted and update the assignment status
    const allSubtasks = await Subtask.find({ assignmentId: assignmentId });
    if (allSubtasks.every((subtask) => subtask.status === "submitted")) {
      // assignment.status = "submitted";
      assignedUser.status = "submitted";
      await assignment.save();
    }

    // Respond with success message
    res.status(200).json({ message: "Subtask submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function submitSubtaskForGroup(req, res) {
  const { subtaskId, groupId } = req.params;
  const captainId = req.user._id;
  try {
    // Find the subtask by its ID
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.json({ Error: "No such subtask exists" });
    }

    if (subtask.dueDate < Date.now()) {
      return res.json("You cannot submit after the due date");
    }
    const Group = await Group.findById(groupId);
    if (Group.captainId.toString() !== captainId.toString()) {
      return res.json({
        Error:
          "You cannot submit this assignment as you are not the captain of the group",
      });
    }

    // Get the assignment associated with the subtask
    const assignmentId = subtask.assignmentId;
    const assignment = await Assignment.findById(assignmentId);

    // Check if the user is part of the assignment
    const assignedGroup = assignment.groupSubmissionStatus.find(
      (member) => member.groupId.toString() === groupId.toString()
    );

    if (!assignedGroup) {
      return res.json({
        Error: "This assignment is not assigned to your group",
      });
    }

    // Check if the subtask has already been submitted by this user
    const existingSubmission = subtask.groupSubmissions.find(
      (submission) => submission.groupId.toString() === groupId.toString()
    );

    if (existingSubmission && existingSubmission.status === "submitted") {
      return res.json({ Error: "You have already submitted this subtask" });
    }

    // let filesData = [];
    // if (req.files && req.files.length > 0) {
    //   filesData = req.files.map(file => ({
    //     filePath: file.path,
    //     fileName: file.originalname,
    //   }));
    // }

    // Add the file attachment to the user's submission
    if (!existingSubmission) {
      subtask.submissions.push({
        userId,
        status: "submitted",
        // userAttachments: filesData,
      });
    } else {
      existingSubmission.status = "submitted";
      // existingSubmission.userAttachments.push(...filesData);
    }

    // Mark the subtask as submitted and update the submission time
    subtask.status = "submitted";
    subtask.submittedAt = new Date();
    await subtask.save();

    // Check if all subtasks are submitted and update the assignment status
    const allSubtasks = await Subtask.find({ assignmentId: assignmentId });

    const allSubmitted = allSubtasks.every((subtask) => {
      const groupSubmission = subtask.groupSubmissions.find(
        (gs) => gs.groupId.toString() === groupId.toString()
      );
      return groupSubmission && groupSubmission.status === "submitted";
    });
    if (allSubmitted) {
      assignedGroup.status = "submitted";
      await assignment.save();
    }

    // Respond with success message
    res.status(200).json({ message: "Subtask submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function unsubmitSubtask(req, res) {
  const { subtaskId } = req.params;
  const userId = req.user._id;

  try {
    // Find the assignment
    const subtask = await Subtask.findById(subtaskId);

    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found" });
    }
    const assignmentId = subtask.assignmentId;
    const assignment = await Assignment.findById(assignmentId);
    // Find the student in the membersStatus array
    const student = assignment.membersStatus.find(
      (member) => member.userId.toString() === userId.toString()
    );
    const studentSubtaskDocument = subtask.submissions.find(
      (member) => member.userId.toString() === userId.toString()
    );
    // Check if the student is found and their status is "submitted"
    if (!student) {
      return res
        .status(404)
        .json({ error: "You are not assigned this subtask" });
    }
    if (!studentSubtaskDocument && student || studentSubtaskDocument.status === "pending") {
      return res.json({ Error: "You cannot unsubmit a pending task" });
    }

    if (studentSubtaskDocument.status === "submitted") {
      studentSubtaskDocument.status = "pending"; // Change the status to "pending"
    }
    student.status = "pending";
    await assignment.save();
    // Save the assignment after updating the student's status
    await subtask.save();

    // Send success response
    res.status(200).json({ message: "Subtask unsubmitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function unsubmitSubtaskforGroup(req, res) {
  const { subtaskId, groupId } = req.params;
  const captainId = req.user._id;

  try {
    const Group = await Group.findById(groupId);
    if (Group.captainId.toString() !== captainId.toString()) {
      return res.json({
        Error:
          "You cannot submit this assignment as you are not the captain of the group",
      });
    }
    // Find the assignment
    const subtask = await Subtask.findById(subtaskId);

    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found" });
    }
    const assignmentId = subtask.assignmentId;
    const assignment = await Assignment.findById(assignmentId);
    // Find the student in the membersStatus array
    const student = assignment.membersStatus.find(
      (member) => member.userId.toString() === captainId.toString()
    );
    const groupSubtaskDocument = subtask.groupSubmissions.find(
      (member) => member.userId.toString() === groupId.toString()
    );
    // Check if the student is found and their status is "submitted"
    if (!student) {
      return res
        .status(404)
        .json({ error: "This assignment is not assigned to your group" });
    }
    if (!groupSubtaskDocument && student || groupSubtaskDocument.status === "pending") {
      return res.json({ Error: "You cannot unsubmit a pending task" });
    }

    if (groupSubtaskDocument.status === "submitted") {
      studentSubtaskDocument.status = "pending"; // Change the status to "pending"
    }
    const membersOfGroup = Group.members;
    for (const member of membersOfGroup) {
      const student = assignment.membersStatus.find(
        (individual) => individual.userId.toString() === member.toString()
      );
      student.status = "pending";
    }
    const group = assignment.groupSubmissionStatus.find(
        (individualgroup) => individualgroup.groupId.toString() === groupId.toString()
      );
      group.status = "pending";
    // Save the assignment after updating the student's status
    await assignment.save();
    await subtask.save();

    // Send success response
    res.status(200).json({ message: "Subtask unsubmitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  submitSubtask,
  submitSubtaskForGroup,
  unsubmitSubtask,
  unsubmitSubtaskforGroup,
};
