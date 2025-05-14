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
  const { subtaskId } = req.params;
  const captainId = req.user._id;
  const { groupId } = req.body;
  try {
    // Find the subtask by its ID
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.json({ Error: "No such subtask exists" });
    }
    const Group = await Group.findById(groupId);
    if(Group.captainId.toString() !== captainId.toString()){
      return res.json({"Error":"You cannot submit this assignment as you are not the captain of the group"});
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
    if(allSubmitted){
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
module.exports = { submitSubtask , submitSubtaskForGroup};
