import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import RSidebar from "../components/RSidebar";
import AssgnCardForReviewer from "../components/AssgnCardForReviewer"; // Make sure this is AssgnCard
import { Box } from "@mui/material";

function AssignmentViewForReviewer() {
  const [allassignmentlist, setallassignmentlist] = useState([]);
  const [userdata, setUserdata] = useState(null);

  async function extractallassignments() {
    try {
      const response = await axios.get("/profile/user", {
        withCredentials: true,
      });
      const _id = response.data.basicUserInfo._id;
      setUserdata(response.data.basicUserInfo);

      const assignmentresponse = await axios.post(
        `/reviewer/getassignment`
      );
      setallassignmentlist(assignmentresponse.data);
    } catch (error) {
      console.error("Error fetching the assignments:", error);
    }
  }

  useEffect(() => {
    extractallassignments();
  }, []);

  if (!userdata) return <h2>Loading ...</h2>;

  const { username } = userdata;

  return (
    <Box sx={{ display: "flex", width: "100vw", bgcolor: "#121212" }}>
{ userdata.role === "reviewee" ? <Sidebar username={userdata.username} /> : <RSidebar username={userdata.username} />}
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {allassignmentlist.map((assignment) => (
          <AssgnCardForReviewer
            title={assignment.title}
            description={assignment.description}
            dueDate={assignment.dueDate}
            members = {assignment.membersStatus.length}
            groups = {assignment.groupSubmissionStatus.length}
            id = {assignment.id}
          />
        ))}
      </Box>
    </Box>
  );
}

export default AssignmentViewForReviewer;
