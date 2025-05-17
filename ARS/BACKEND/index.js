const express = require('express'); // Require express BEFORE using it
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const groupRoute = require('./routes/group');
const assignmentRoute = require('./routes/assignment');
const reviewerRoute = require("./routes/reviewer");
const profileRoute = require("./routes/profile");
const subtaskRoute = require("./routes/subtask");
const { connectToMongoDB } = require('./connect');

const app = express();
const port = process.env.PORT || 8000; // Use environment variable for port

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/group", groupRoute);
app.use("/assignment", assignmentRoute);
app.use("/reviewer" , reviewerRoute);
app.use("/profile" , profileRoute);
app.use("/subtask" , subtaskRoute);
// Connect to MongoDB (Use .env instead of hardcoding)
const mongoURI ="mongodb://127.0.0.1:27017/ARS";
connectToMongoDB(mongoURI)
    .then(() => console.log("MongoDB is connected to the server"))
    .catch((e) => console.error(" Error in connecting to the DB:", e));

// Start the server
app.listen(port, () => {
    console.log(`Server is live on port ${port}`);
});
