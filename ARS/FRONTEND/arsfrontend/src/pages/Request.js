import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";

function Request() {
  const [request, setRequest] = useState([]);
  const [userdata, setUserdata] = useState(null);
  const [displayRequests, setDisplayRequests] = useState([]);

  // Fetch user data and all requests on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("/profile/user", { withCredentials: true });
        setUserdata(userRes.data.basicUserInfo);

        const requestRes = await axios.post(`/user/gettagging`);
        setRequest(requestRes.data || []);
      } catch (error) {
        console.error("Initial fetch error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const prepareDisplay = async () => {
      const userCache = {};
      const assignmentCache = {};

      const fetchUserName = async (id) => {
        if (!id) return null;
        if (userCache[id]) return userCache[id];
        try {
          const res = await axios.post(`/user/getuserbyid/${id}`);
          const name = res.data?.name;
          if (name) {
            userCache[id] = name;
            return name;
          }
        } catch (err) {
          console.warn("Error fetching user:", id, err.message);
        }
        return null;
      };

      const fetchAssignmentTitle = async (id) => {
        if (!id) return null;
        if (assignmentCache[id]) return assignmentCache[id];
        try {
          const res = await axios.get(`/assignment/getselectedassignmentinfo/${id}`);
          const title = res.data?.title;
          if (title) {
            assignmentCache[id] = title;
            return title;
          }
        } catch (err) {
          console.warn("Error fetching assignment:", id, err.message);
        }
        return null;
      };

      const processed = await Promise.all(
        request.map(async (doc) => {
          const revieweeName = await fetchUserName(doc.revieweeRequesting);
          const assignmentTitle = await fetchAssignmentTitle(doc.assignmentId);

          // Parse reviewer IDs (either string or array)
          const reviewerIds = Array.isArray(doc.reviewerRequested)
            ? doc.reviewerRequested
            : [doc.reviewerRequested];

          const reviewerNames = await Promise.all(
            reviewerIds.map((id) => fetchUserName(id))
          );

          const validReviewerNames = reviewerNames.filter(Boolean); // Remove nulls

          // Only include requests with valid reviewee, at least 1 reviewer, and assignment
          if (revieweeName && assignmentTitle && validReviewerNames.length > 0) {
            return {
              id: doc._id,
              revieweeName,
              reviewerNames: validReviewerNames,
              assignmentTitle,
            };
          }

          return null;
        })
      );

      setDisplayRequests(processed.filter(Boolean));
    };

    if (request.length > 0) {
      prepareDisplay();
    }
  }, [request]);

  if (!userdata) {
    return <p style={{ color: "white" }}>Loading user data...</p>;
  }

  return (
    <Box sx={{ display: "flex", width: "100vw", bgcolor: "#121212" }}>
      <Sidebar username={userdata.username} />
      <Box sx={{ p: 2, color: "white" }}>
        {displayRequests.length === 0 ? (
          <p>No valid requests found</p>
        ) : (
          displayRequests.map(({ id, revieweeName, reviewerNames, assignmentTitle }) => (
            <Box
              key={id}
              sx={{ mb: 2, border: "1px solid #444", p: 2, borderRadius: 1 }}
            >
              <p>
                <strong>{revieweeName}</strong> asked for a review from{" "}
                <strong>{reviewerNames.join(", ")}</strong> for the assignment{" "}
                <strong>{assignmentTitle}</strong>.
              </p>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default Request;
