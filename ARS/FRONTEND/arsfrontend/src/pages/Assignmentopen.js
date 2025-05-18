import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
import "@fontsource/inter/900.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/500.css";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

function AssignmentToOpen() {
  const { id } = useParams();
  const [userdata, setUserdata] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/profile/user", {
          withCredentials: true,
        });
        setUserdata(response.data.basicUserInfo);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };
    fetchUser();
  }, []);
  const [assignmentinformation, setassignmentinformation] = useState(null);

  const fetchassignment = async () => {
    try {
      console.log(id);
      const response = await axios.get(
        `/assignment/getselectedassignmentinfo/${id}`
      );
      setassignmentinformation(response.data);
      console.log(assignmentinformation);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchassignment();
  }, [id]);
  if (!userdata) return <h1>Loading user information...</h1>;
  if (!assignmentinformation) return <h1>Assignment Loading</h1>;
  const { username } = userdata;

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#121212",
        color: "#fff",
        height: "100vh",
      }}
    >
      <Sidebar username={username} />
      <main style={{ margin: "2rem" }}>
        <h1>{assignmentinformation.title}</h1>
        <p>{assignmentinformation.description}</p>
        <p>
          Due Date:{" "}
          {new Date(assignmentinformation.dueDate).toLocaleDateString()}
        </p>
        <p>Assigned By: {assignmentinformation.createdBy}</p>
      </main>
    </Box>
  );
}

export default AssignmentToOpen;
