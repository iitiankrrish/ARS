const User = require("./user");
const Group = require("./group");
const Subtask = require("./subtask");
const Reviewer = require("./reviewer");
const mongoose = require("mongoose");
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedToStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Link to the user (admin/reviewer) who created the assignment
  },
  assignedToGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group", // Link to the user (admin/reviewer) who created the assignment
  },
  assignedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value.getTime() > Date.now();
      },
      message: "Due date has to be of the future",
    },
  },
  membersStatus: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: ["pending", "submitted", "accepted"],
        default: "pending",
      },
      submittedAt: { type: Date },
      reviews: [
        {
          reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "Reviewer" },
          comments: { type: String },
          iterationNumber: { type: Number },
          reviewedAt: { type: Date, default: Date.now },
        },
      ],
      revieweeComments: [
        {
          comment: { type: String },
          commentedAt: { type: Date, default: Date.now },
          iterationNumber: { type: Number },
        },
      ],
    },
  ],
  groupSubmissionStatus: [
    {
      groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
      status: {
        type: String,
        enum: ["pending", "submitted", "accepted"],
        default: "pending",
      }, // THIS IS FOR THE REVIEWEE
      submittedAt: { type: Date },
      reviews: [
        {
          reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "Reviewer" },
          comments: { type: String },
          iterationNumber: { type: Number },
          reviewedAt: { type: Date, default: Date.now },
        },
      ],
      captainComments: [
        {
          comment: { type: String },
          commentedAt: { type: Date, default: Date.now },
          iterationNumber: { type: Number },
        },
      ],
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Link to the user who created the assignment
    required: true,
  },
  subtask: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subtask",
    },
  ],
  reviewerAttachments: [
    {
      filePath: { type: String, required: true }, // Path to the file (e.g., in the 'uploads' directory)
      fileName: { type: String, required: true }, // Name of the file
      uploadedAt: { type: Date, default: Date.now }, // Timestamp when the file was uploaded
    },
  ],
  userAttachments: [
    {
      filePath: { type: String, required: true }, // Path to the file (e.g., in the 'uploads' directory)
      fileName: { type: String, required: true }, // Name of the file
      uploadedAt: { type: Date, default: Date.now }, // Timestamp when the file was uploaded
    },
  ],
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
});
const Assignment = mongoose.model("assignment", assignmentSchema);
module.exports = Assignment;
