import Sidebar from "../components/Sidebar";
import RSidebar from "../components/RSidebar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fontsource/inter/900.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/500.css";
import { Box } from "@mui/material";

function Profile() {
  const [userdata, setUserdata] = useState(null);
  const [assignmentdetails, setassignmentdetails] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/profile/user", {
          withCredentials: true,
        });
        console.log(response);
        setUserdata(response.data.basicUserInfo);
        setassignmentdetails({
          reviewedAssignmentlength: response.data.reviewedAssignmentslength,
          acceptedAssignmentlength: response.data.acceptedAssignmentslength,
          pendingAssignmentlength: response.data.pendingAssignmentslength,
        });
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUser();
  }, []);
  if (!userdata) {
    return <h1>loading information from server...</h1>;
  }
  const {
    username,
    name,
    role,
    email,
    phoneNumber,
  } = userdata;
  const {reviewedAssignmentlength , acceptedAssignmentlength , pendingAssignmentlength} = assignmentdetails
//   console.log(acceptedAssignmentlength);
  return (
    <>
      <Box sx={{ display: "flex" }}>
{ userdata.role === "reviewee" ? <Sidebar username={userdata.username} /> : <RSidebar username={userdata.username} />}
        <main style={{ margin: "2rem" }}>
          <h1>Username: {username}</h1>
          <h1>Name: {name}</h1>
          <h1>Email: {email}</h1>
          <h1>Role: {role}</h1>
          <h1>Phone: {phoneNumber}</h1>
          <h1>Submitted Assignments: {reviewedAssignmentlength}</h1>
          <h1>Pending Assignments: {pendingAssignmentlength}</h1>
          <h1>Accepted Assignements: {acceptedAssignmentlength}</h1>
        </main>
      </Box>
    </>
  );
}

export default Profile;
