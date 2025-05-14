const Reviewer = require("../models/reviewer");
const Assignment = require("../models/assignment");
const Subtask = require("../models/subtask");
async function sendRequest(req, res) {
  const { assignmentId, reviewerId } = req.body;
  const requestedBy = req.user._id;

  // Validate inputs
  if (!assignmentId) {
    return res.status(400).json({ Error: "No assignment found" });
  }
  if (!reviewerId) {
    return res.status(400).json({ Error: "No reviewer found to add" });
  }

  try {
    // Find the Reviewer document by assignmentId
    const reviewerObject = await Reviewer.findOne({ assignment: assignmentId });

    if (!reviewerObject) {
      return res
        .status(404)
        .json({ Error: "Assignment not found in reviewer records" });
    }

    // Find if the reviewer exists in the list and get their details
    const existingReviewer = reviewerObject.reviewers.find(
      (reviewer) => reviewer.userId.toString() === reviewerId.toString()
    );

    if (existingReviewer) {
      // Handle the response based on the addedStatus of the reviewer
      if (existingReviewer.addedStatus === "Accepted") {
        return res.status(200).json({
          Message: "Request to reviewer was sent and they accepted the request",
        });
      }
      if (existingReviewer.addedStatus === "Rejected") {
        return res.status(200).json({
          Message: "Request to reviewer was sent and they rejected the request",
        });
      }
      if (existingReviewer.addedStatus === "Pending") {
        return res.status(200).json({
          Message:
            "Request to reviewer was sent and they have not yet accepted the request",
        });
      }
    }

    // Add the reviewer to the array with status "Pending"
    reviewerObject.reviewers.push({
      userId: reviewerId,
      addedStatus: "Pending", // Default status is Pending
    });

    // Save the updated Reviewer document
    await reviewerObject.save();

    return res
      .status(201)
      .json({ message: "Request sent to reviewer successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ Error: "Failed to send request", details: err.message });
  }
}
async function responseToRequest(req, res) {
  const { assignmentId, response } = req.body;
  const reviewerId = req.user._id; // Get the reviewerId from the logged-in user

  if (!assignmentId || !response) {
    return res
      .status(400)
      .json({ Error: "Assignment ID and Response are required" });
  }

  try {
    // Find the Reviewer document and update the specific reviewer status
    const reviewerObject = await Reviewer.findOne({ assignment: assignmentId });

    if (!reviewerObject) {
      return res
        .status(404)
        .json({ Error: "Assignment not found in reviewer records" });
    }

    // Find the reviewer in the array
    const existingReviewer = reviewerObject.reviewers.find(
      (reviewer) => reviewer.userId.toString() === reviewerId.toString()
    );

    if (!existingReviewer) {
      return res.status(404).json({ Error: "Reviewer not found" });
    }

    // Update the addedStatus of the reviewer
    existingReviewer.addedStatus = response;

    if (response === "Rejected") {
      // Remove the reviewer from the reviewers array
      await Reviewer.updateOne(
        { assignment: assignmentId },
        { $pull: { reviewers: { userId: reviewerId } } } // Use $pull to remove the reviewer from the array
      );
      return res
        .status(200)
        .json({ message: "Reviewer response rejected and removed" });
    }

    // Save the updated Reviewer document (if status is not Rejected)
    await reviewerObject.save();

    return res
      .status(200)
      .json({ message: "Reviewer response updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      Error: "Failed to update reviewer response",
      details: err.message,
    });
  }
}
async function giveReviewTheAssignmentAndNotAcceptIt(req, res) {
  try {
    const { assignmentId, studentId } = req.params;
    const reviewerId = req.user._id;
    const { comments, iterationNumber } = req.body;

    // Ensure the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    if(student.status != "submitted"){
      return res.json({"Error":"You cannot review a pre-evaluated or an unsubmitted assignment"});
    }

    // Find student in the assignment's membersStatus
    const student = assignment.membersStatus.find(
      (s) => s.userId.toString() === studentId
    );
    if (!student) {
      return res
        .status(404)
        .json({ error: "Student not found in this assignment" });
    }
    assignment.reviewCount = assignment.reviewCount +1;

    // Add review to student's reviews
    student.reviews.push({
      reviewerId,
      comments,
      iterationNumber,
      reviewedAt: new Date(),
    });

    student.status = "pending"; // Mark status as pending
    await assignment.save();

    res.status(200).json({ success: "Review submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function acceptTheAssignment(req, res) {
  try {
    const { assignmentId, studentId } = req.params;

    // Ensure the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Find student in the assignment's membersStatus
    const student = assignment.membersStatus.find(
      (s) => s.userId.toString() === studentId
    );
    if (!student) {
      return res
        .status(404)
        .json({ error: "Student not found in this assignment" });
    }

    student.status = "accepted"; // Mark as accepted
    await assignment.save();

    res.status(200).json({ success: "Assignment accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { sendRequest, responseToRequest ,giveReviewTheAssignmentAndNotAcceptIt,acceptTheAssignment};
