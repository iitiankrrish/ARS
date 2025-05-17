const mongoose = require("mongoose");
const User = require("../models/user");
const Assignment = require("../models/assignment");

const reviewerSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },
  reviewers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      addedStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        required: true
      }
    }
  ]
});
const Reviewer = new mongoose.model("Reviewer", reviewerSchema);
module.exports = Reviewer;
