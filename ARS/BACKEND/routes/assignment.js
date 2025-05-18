const express = require("express");
const multer = require("multer");
const path = require("path");
const { UserLoggedInOrNot } = require("../middlewares/authorisation");
const router = express.Router();
const allowedFileTypes = /pdf|doc|docx/;

// Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Folder to store files
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//     ); // Set unique file names
//   },
// });

// Multer file filter for validation
// const fileFilter = (req, file, cb) => {
//   const fileExt = path.extname(file.originalname).toLowerCase();

//   // Check if file extension matches allowed types (PDF, Word)
//   if (!allowedFileTypes.test(fileExt)) {
//     return cb(new Error("Only PDF, DOC, DOCX files are allowed"), false);
//   }

//   cb(null, true); // Accept file
// };

// Multer configuration with file size limit and file type validation
// const   = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
//   },
//   fileFilter: fileFilter,
// }).array("attachments", 5); // Limit to 5 files

const {
  createAssignment,
  submissionOfAssignment,
  sendAssignment,
  assignmentUnsubmission,
  addUserOrGroupToExistingAssignment,
  removeAssignment,
  getpendingassignments,
  getacceptedassignments,
  getreviewedassignments,
  getallassignments,
} = require("../controllers/assignment");
const {
  roleVerifierForAdminAndForReviewer,
} = require("../middlewares/assignment");
router.post(
  "/create",
  UserLoggedInOrNot,
  roleVerifierForAdminAndForReviewer,
  createAssignment
);
router.post("/submit/:assignmentId", UserLoggedInOrNot, submissionOfAssignment);
router.post("/send/:assignmentId", UserLoggedInOrNot, sendAssignment);
router.post(
  "/unsubmit/:assignmentId",
  UserLoggedInOrNot,
  assignmentUnsubmission
);
router.post(
  "/add/:assignmentId",
  UserLoggedInOrNot,
  addUserOrGroupToExistingAssignment
);
router.post("/remove/:assignmentId", UserLoggedInOrNot, removeAssignment);
router.get(
  "/getpendingassignments/:studentId",
  UserLoggedInOrNot,
  getpendingassignments
);
router.get(
  "/getreviewedassignments/:studentId",
  UserLoggedInOrNot,
  getreviewedassignments
);
router.get(
  "/getacceptedassignments/:studentId",
  UserLoggedInOrNot,
  getacceptedassignments
);
router.get(
  "/getallassignments/:studentId",
  UserLoggedInOrNot,
  getallassignments
);
module.exports = router;
