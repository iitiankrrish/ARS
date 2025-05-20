import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import RSidebar from "../components/RSidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function AssignmentToOpen() {
  const { id } = useParams(); // assignmentId
  const theme = useTheme();

  const [userdata, setUserdata] = useState(null); // user profile data
  const [revieweeid, setRevieweeid] = useState(""); // actual user _id
  const [assignmentinformation, setAssignmentInformation] = useState(null);
  const [reviewernameinfo, setReviewernameinfo] = useState([]); // All reviewers
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([]); // IDs to tag
  const [revieweeComments, setRevieweeComments] = useState([]); // Previous comments
  const [commententered, setCommentEntered] = useState(""); // New comment
  const [status, setstatus] = useState("rahul"); // Default fallback

  // Handle comment input
  const commenthandler = (e) => {
    setCommentEntered(e.target.value);
  };
  // console.log(assignmentinformation);
  // Fetch user, assignment, and reviewers on first render
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/profile/user", {
          withCredentials: true,
        });
        setUserdata(response.data.basicUserInfo);
        setRevieweeid(response.data.basicUserInfo._id);
        // console.log("Reviewee ID set to:", response.data._id);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `/assignment/getselectedassignmentinfo/${id}`
        );
        setAssignmentInformation(response.data);
      } catch (error) {
        console.error("Failed to fetch assignment", error);
      }
    };

    const getReviewerInfo = async () => {
      try {
        const response = await axios.post(`/reviewer/getreviewer/${id}`);
        setReviewernameinfo(response.data);
      } catch (error) {
        console.error("Failed to fetch reviewer info", error);
      }
    };

    fetchUser();
    fetchAssignment();
    getReviewerInfo();
  }, [id]);

  // Fetch previous comments after revieweeid is available
  useEffect(() => {
    if (revieweeid) {
      const getRevieweeComments = async () => {
        try {
          const response = await axios.get(
            `/assignment/getcomments/${revieweeid}/${id}`
          );
          setRevieweeComments(response.data);
          console.log("comments are : ", response.data);
        } catch (error) {
          console.log("Failed to fetch comments", error);
        }
      };
      getRevieweeComments();
    }
  }, [revieweeid, id]);

  useEffect(() => {
    if (revieweeid) {
      const getStatus = async () => {
        try {
          const response = await axios.get(
            `/assignment/getstatus/${revieweeid}/${id}`
          );
          console.log("Fetched status:", response.data);
          setstatus(response.data); // ✅ backend returns a plain string like "pending"
        } catch (error) {
          console.log("Failed to fetch status", error);
        }
      };
      console.log("sdfghjkl;lkjhgfd");
      getStatus();
    }
  }, [revieweeid, id]);

  // Handle reviewer dropdown change
  const handleReviewerChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedReviewerIds(
      typeof value === "string" ? value.split(",") : value
    );
  };

  // Render reviewer name in chip
  const renderChipLabel = (userId) => {
    const reviewer = reviewernameinfo.find((r) => r._id.userId === userId);
    return reviewer?.name || userId;
  };

  // Submit comment + tag reviewers
  const submitfunction = async () => {
    try {
      // 1. Submit the assignment with the comment
      await axios.post(`/assignment/submit/${id}`, {
        comment: commententered,
        iterationNumber: 1,
      });

      // 2. Request review from reviewers
      if (selectedReviewerIds.length > 0) {
        await axios.post("/user/reviewRequestToReviewer", {
          reviewerIds: selectedReviewerIds,
          assignmentId: id,
        });
      }

      alert("Submission successful!");
    } catch (error) {
      console.log("Submission error:", error);
      alert("Submission failed.");
    }
  };

  // Loading fallback
  if (!userdata || !assignmentinformation) {
    return <h1>Loading...</h1>;
  }

  // ✅ Logs status only when render happens
  console.log("Current Status:", status);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#121212",
        color: "#fff",
        height: "100vh",
      }}
    >
     { userdata.role === "reviewee" ? <Sidebar username={userdata.username} /> : <RSidebar username={userdata.username} />}

      <Box sx={{ margin: 2, marginLeft: 5 }}>
        <Typography variant="h2" sx={{ fontWeight: 800 }}>
          {assignmentinformation.title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            marginTop: 5,
            padding: 2,
            border: "2px solid #ff8c00",
            borderRadius: 2,
          }}
        >
          {assignmentinformation.description}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            marginTop: 3,
            border: "2px solid #ff8c00",
            borderRadius: 2,
            padding: 2,
            width: 350,
          }}
        >
          Due by: {new Date(assignmentinformation.dueDate).toLocaleDateString()}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            marginTop: 5,
            borderBottom: "2px solid #ff8c00",
            width: 150,
          }}
        >
          Attachments
        </Typography>
      </Box>

      {/* Right pane */}
      <Box
        sx={{
          backgroundColor: "white",
          marginLeft: "auto",
          padding: 3,
          width: 400,
          height: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#121212",
            fontWeight: 800,
            fontSize: 40,
            marginTop: 2,
          }}
        >
          Submit
        </Typography>

        {/* Multi-Select Dropdown */}
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="reviewer-select-label">Reviewers</InputLabel>
          <Select
            labelId="reviewer-select-label"
            id="reviewer-select"
            multiple
            value={selectedReviewerIds}
            onChange={handleReviewerChange}
            input={<OutlinedInput label="Reviewers" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((userId) => (
                  <Chip key={userId} label={renderChipLabel(userId)} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {reviewernameinfo.map((reviewer) => (
              <MenuItem key={reviewer._id.userId} value={reviewer._id.userId}>
                {reviewer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Comment box */}
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
        >
          <TextField
            id="outlined-basic"
            label="Comment"
            variant="outlined"
            onChange={commenthandler}
            value={commententered}
            name="commententered"
          />
        </Box>

        {/* Previous Comments */}
        <Box
          sx={{
            padding: 2,
            border: "2px solid #ff8c00",
            width: "90%",
            marginTop: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#121212", mb: 1 }}
          >
            Previous Comments
          </Typography>
          {revieweeComments.length > 0 ? (
            revieweeComments.map((comment, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  p: 1,
                  bgcolor: "#f5f5f5",
                  color: "#121212",
                  borderRadius: 1,
                  fontSize: "14px",
                }}
              >
                {comment} {/* Just render the string directly */}
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#666" }}>
              No previous comments yet.
            </Typography>
          )}
        </Box>

        {/* Submit button */}
        <Button
          variant="contained"
          sx={{ marginTop: 4 }}
          onClick={submitfunction}
          disabled={
            status !== "pending" ||
            new Date(assignmentinformation.dueDate).getTime() < Date.now()
          }
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default AssignmentToOpen;
