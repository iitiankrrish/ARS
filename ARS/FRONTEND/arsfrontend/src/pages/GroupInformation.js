import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Sidebar from "../components/Sidebar";
import axios from "axios";

function GroupToOpen() {
  const [userdata, setUserdata] = useState(null);
  const [groupdata, setGroupdata] = useState(null);
  const [captainName, setCaptainName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupinfo, setGroupinfo] = useState(null);

  // Load groupinfo from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem("groupinfo");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setGroupinfo(parsed);
      } catch (e) {
        console.error("Failed to parse stored groupinfo", e);
      }
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("/profile/user", { withCredentials: true });
      setUserdata(res.data.basicUserInfo);
    } catch (error) {
      console.error("User data error:", error);
    }
  };

  // Fetch group data by groupinfo._id
  const fetchGroupData = async (id) => {
    try {
      const res = await axios.post(`/group/group/${id}`, { withCredentials: true });
      const data = res.data;
      setGroupdata(data);

      // Fetch captain name
      const captainRes = await axios.post(`/user/getuserbyid/${data.groupbasicinfo.captainId}`);
      setCaptainName(captainRes.data.name);

      // Fetch creator name
      const creatorRes = await axios.post(`/user/getuserbyid/${data.groupbasicinfo.createdBy}`);
      setCreatorName(creatorRes.data.name);

      // Fetch members data
      const memberInfoPromises = data.groupbasicinfo.members.map((memberId) =>
        axios.post(`/user/getuserbyid/${memberId}`)
      );
      const memberInfoResponses = await Promise.all(memberInfoPromises);
      const memberData = memberInfoResponses.map((res) => res.data);
      setMembers(memberData);

      setLoading(false);
    } catch (err) {
      console.error("Group data error:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    // Wait until both userdata and groupinfo are loaded
    if (userdata && groupinfo && groupinfo._id) {
      fetchGroupData(groupinfo._id);
    }
  }, [userdata, groupinfo]);

  if (loading || !groupdata || !userdata) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#121212",
        }}
      >
        <CircularProgress color="warning" />
      </Box>
    );
  }

  const { groupbasicinfo, myAssignments } = groupdata;

  return (
    <Box sx={{ display: "flex", bgcolor: "#121212", color: "#fff", minHeight: "100vh" }}>
      <Sidebar username={userdata.username} />

      <Box sx={{ flexGrow: 1, padding: 4 }}>
        <Typography variant="h3" fontWeight={800}>
          {groupbasicinfo.groupName}
        </Typography>

        <Typography
          variant="h6"
          sx={{ mt: 3, p: 2, border: "2px solid #ff8c00", borderRadius: 2, width: "fit-content" }}
        >
          Group Number: {groupbasicinfo.groupId}
        </Typography>

        <Typography
          variant="h6"
          sx={{ mt: 2, p: 2, border: "2px solid #ff8c00", borderRadius: 2, width: "fit-content" }}
        >
          Captain: {captainName}
        </Typography>

        <Typography
          variant="h6"
          sx={{ mt: 2, borderBottom: "2px solid #ff8c00", width: "fit-content", pb: 1 }}
        >
          Created By: {creatorName}
        </Typography>

        <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
          Assignments
        </Typography>
        {myAssignments.length === 0 ? (
          <Typography>No assignments found.</Typography>
        ) : (
          myAssignments.map((assignment) => (
            <Box
              key={assignment._id}
              sx={{
                background: "#1e1e1e",
                border: "1px solid #ff8c00",
                borderRadius: 2,
                padding: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" color="orange">
                {assignment.title}
              </Typography>
              <Typography>Description: {assignment.description}</Typography>
              <Typography>Due: {new Date(assignment.dueDate).toLocaleDateString()}</Typography>
              <Chip
                label={assignment.groupSubmissionStatus[0]?.status || "pending"}
                color="warning"
                sx={{ mt: 1 }}
              />
            </Box>
          ))
        )}
      </Box>

      {/* Right Pane - Member Accordion */}
      <Box
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          width: 400,
          height: "100vh",
          overflowY: "auto",
          p: 3,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight={700}>
          Group Members
        </Typography>
        {members.map((member) => (
          <Accordion key={member._id}>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              <Typography>{member.username}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                <ul>
                  <li>Phone: {member.phoneNumber}</li>
                  <li>Email: {member.email}</li>
                  <li>Name: {member.name}</li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}

export default GroupToOpen;
