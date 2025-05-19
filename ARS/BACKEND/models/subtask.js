const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
    },
    status: {
        type: String,
        enum: ["pending", "submitted", "under review", "accepted"],
        default: "pending",
    },
    // `submittedAt` is now inside `submissions` so each user has their own
    submissions: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            status: {
                type: String,
                enum: ["pending", "submitted", "under review", "accepted"],
                default: "pending",
            },
            userAttachments: [
                {
                    filePath: { type: String, required: true },
                    fileName: { type: String, required: true },
                    uploadedAt: { type: Date, default: Date.now },
                },
            ],
            submittedAt: {
                type: Date,
                default: Date.now
            },
        },
    ],
    groupSubmissions: [
        {
            groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
            status: {
                type: String,
                enum: ["pending", "submitted", "under review", "accepted"],
                default: "pending",
            },
            userAttachments: [
                {
                    filePath: { type: String, required: true },
                    fileName: { type: String, required: true },
                    uploadedAt: { type: Date, default: Date.now },
                },
            ],
            submittedAt: {
                type: Date,
                default: Date.now
            },
        },
    ],
}, {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
});

const Subtask = mongoose.model('Subtask', subtaskSchema);
module.exports = Subtask;
