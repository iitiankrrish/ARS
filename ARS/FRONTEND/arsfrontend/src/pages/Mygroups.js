import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Groupcard from "../components/Groupcard";
import { Box } from "@mui/material";

function Allgroups() {
  const [userdata, setUserdata] = useState(null);
  const [groupdata, setGroupdata] = useState(null);

  // Fetch user data
  async function userdataretriever() {
    try {
      const response = await axios.get("/profile/user", {
        withCredentials: true,
      });
      const user = response.data.basicUserInfo;
      setUserdata(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Fetch groups after userdata is available
  async function extractallgroups() {
    try {
      const response = await axios.post(`/group/mygroups/${userdata._id}`, {
        withCredentials: true,
      });
      setGroupdata(response.data);
    } catch (error) {
      console.error("Error fetching the groups:", error);
    }
  }

  // Fetch user on mount
  useEffect(() => {
    userdataretriever();
  }, []);

  // Fetch groups only when userdata is loaded
  useEffect(() => {
    if (userdata && userdata._id) {
      extractallgroups();
    }
  }, [userdata]);

  // Loading state
  if (!groupdata) return <h2 style={{ color: "white" }}>Loading ...</h2>;

  const username = userdata?.username ?? "User";

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
        {groupdata.map((group) => (
          <Groupcard
            key={group.groupId}
            groupname={group.groupName}
            groupid={group.groupId}
            captainid = {group.captainId}
            memberlength={group.members.length}
            creator={group.createdBy} // If you want name instead of ID, modify this
          />
        ))}
      </Box>
    </Box>
  );
}

export default Allgroups;
