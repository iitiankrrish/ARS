const mongoose = require("mongoose");

const reviewStorageSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    revieweeRequesting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewerRequested: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  { timestamps: true }
);

const ReviewRequest = mongoose.model("ReviewRequest", reviewStorageSchema);

module.exports = ReviewRequest;
