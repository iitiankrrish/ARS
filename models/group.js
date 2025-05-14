const mongoose = require('mongoose');
const User = require('./user');

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    groupId: {
        type: Number,
        required: true,
        unique: true, // Ensure that groupId is unique
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    captainId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true ,
    }
}, { timestamps: true }); // Optionally add timestamps for createdAt and updatedAt

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
