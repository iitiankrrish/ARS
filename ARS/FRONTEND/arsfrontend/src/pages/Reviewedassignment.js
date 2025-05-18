import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AssgnCard from "../components/Card"; // Make sure this is AssgnCard
import { Box } from "@mui/material";

function Reviewedassignment() {
  const [reviewedassignmentlist, setreviewedassignmentlist] = useState([]);
  const [userdata, setUserdata] = useState(null);

  async function extractreviewedassignments() {
    try {
      const response = await axios.get("/profile/user", {
        withCredentials: true,
      });
      const _id = response.data.basicUserInfo._id;
      setUserdata(response.data.basicUserInfo);

      const assignmentresponse = await axios.get(
        `/assignment/getacceptedassignments/${_id}`
      );
      setreviewedassignmentlist(assignmentresponse.data);
    } catch (error) {
      console.error("Error fetching reviewed assignments:", error);
    }
  }

  useEffect(() => {
    extractreviewedassignments();
  }, []);

  if (!userdata) return <h2>Loading ...</h2>;

  const { username } = userdata;
  // console.log(id);
  return (
    <Box sx={{ display: "flex", width: "100vw", bgcolor: "#121212" }}>
      <Sidebar username={username} />
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {reviewedassignmentlist.map((assignment) => (
          <AssgnCard
            title={assignment.title}
            description={assignment.description}
            dueDate={assignment.dueDate}
            status={assignment.status}
            id = {assignment._id}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Reviewedassignment;
