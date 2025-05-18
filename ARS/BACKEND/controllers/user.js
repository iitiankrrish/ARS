const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Reviewer = require("../models/reviewer");
const Assignment = require("../models/assignment");
const ReviewRequest = require("../models/reviewRequestStorage")
const { setUser } = require("../services/auth");

async function handleSignUp(req, res) {
    try {
        const { name, username, password, phoneNumber, email ,role } = req.body;

        // Check if email already exists
        const preExistingEmail = await User.findOne({ email });
        if (preExistingEmail) {
            return res.status(400).json({ "Error": "Email already exists" });
        }

        // Check if phone number already exists
        const preExistingPhoneNumber = await User.findOne({ phoneNumber });
        if (preExistingPhoneNumber) {
            return res.status(400).json({ "Error": "Phone Number already exists" });
        }
        const userRole = role||"reviewee";
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in the database
        await User.create({
            name,
            username,
            password: hashedPassword,
            phoneNumber,
            email,
            role: userRole
        });

        return res.status(201).json({ "Success": "You have been Signed Up successfully" });
    } catch (error) {
        console.error("Error in sign-up:", error);
        return res.status(500).json({ "Error": "Internal Server Error" });
    }
}
async function handleLogIn(req, res) {
    try {
        const { email, phoneNumber, password } = req.body;

        // Find the user in the database
        const currentUser = await User.findOne({ email, phoneNumber });

        if (!currentUser) {
            return res.status(400).json({ "Error": "Invalid email or phone number" });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, currentUser.password);
        if (!isMatch) {
            return res.status(400).json({ "Error": "Invalid Password" });
        }

        // Generate token
        const token = setUser(currentUser);

        // Set cookie
        res.cookie("loginToken", token, {
            maxAge: 86400000, // 1 day
            httpOnly: true
        });

        res.json({ "Success": "Successfully logged into your account" });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ "Error": "Internal Server Error" });
    }
}
async function handleLogOut(req, res) {
    res.clearCookie("loginToken");
    res.status(200).json({ "Success": "Logged Out Successfully" });
}
async function askForReview(req, res) {
  try {
    const { reviewerIds, assignmentId } = req.body;
    console.log(req.user);
    const studentId = req.user._id;
    // Validate assignment and student existence
    const assignment = await Assignment.findById(assignmentId);
    const reviewee = await User.findById(studentId);

    if (!assignment || !reviewee) {
      return res.status(404).json({ error: "Assignment or student not found" });
    }

    // Fetch reviewer mapping document
    const reviewerDoc = await Reviewer.findOne({ assignment: assignmentId });
    if (!reviewerDoc) {
      return res.status(404).json({ error: "Reviewer mapping not found for this assignment" });
    }

    // Validate all reviewer IDs
    const invalidReviewers = [];
    for (const reviewerId of reviewerIds) {
      const linked = reviewerDoc.reviewers.find(
        (r) => r.userId.toString() === reviewerId.toString()
      );
      const exists = await User.exists({ _id: reviewerId });

      if (!linked || !exists) {
        invalidReviewers.push(reviewerId);
      }
    }

    if (invalidReviewers.length > 0) {
      return res.status(400).json({
        error: "Some reviewers are invalid or not linked to this assignment",
        invalidReviewers,
      });
    }

    // Save single review request with all reviewers
    const newReviewRequest = new ReviewRequest({
      assignmentId,
      revieweeRequesting: studentId,
      reviewerRequested: reviewerIds,
    });

    await newReviewRequest.save();

    return res.status(200).json({ success: "Review request created successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports =  { handleSignUp, handleLogIn, handleLogOut ,askForReview};
