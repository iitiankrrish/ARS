import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import {
  AlternateEmail,
  CheckCircleOutline,
  Email,
  GroupAdd,
  HelpOutline,
  HomeFilled,
  People,
  PersonOutline,
} from "@mui/icons-material";

import "@fontsource/inter/900.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/700.css";
import axios from "axios";

function Sidebar({ username }) {
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      background: {
        sidebarbg: "#161412",
        hovercolor: "#1e1e1e",
      },
      cta: {
        main: "#ff8c00",
        contrastText: "#fff",
      },
    },
  });

  const handleLogout = async () => {
    try {
      const res = await axios.post("/user/logout", {}, { withCredentials: true });
      console.log("Logout successful:", res);
      navigate("/user/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuItems = [
    { icon: <HomeFilled />, label: "HOME" },
    { icon: <CheckCircleOutline />, label: "REVIEWED" },
    { icon: <HelpOutline />, label: "UNREVIEWED" },
    { icon: <Email />, label: "MESSAGES" },
    { icon: <PersonOutline />, label: "VIEW PROFILE" },
    { icon: <AlternateEmail />, label: "REQUESTS" },
    { icon: <People />, label: "CREATE GROUP" },
    { icon: <GroupAdd />, label: "JOIN GROUP" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: 300,
          height: "100vh",
          bgcolor: theme.palette.background.sidebarbg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* User Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: 2,
            marginLeft: 5,
          }}
        >
          <Avatar
            alt="UserName"
            src="https://wallpapers.com/images/featured/charlie-puth-ehkdpdekw1tkok14.jpg"
            sx={{ width: 50, height: 50 }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "white",
              fontFamily: "Inter",
              marginLeft: 3,
              fontSize: "27px",
            }}
          >
            {username}
          </Typography>
        </Box>

        {/* Divider */}
        <Divider
          sx={{
            borderColor: theme.palette.cta.contrastText,
            paddingTop: 2,
          }}
        />

        {/* Sidebar Menu */}
        <Box sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}>
          {menuItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                paddingLeft: 4,
                color: "white",
                "&:hover": {
                  bgcolor: theme.palette.background.hovercolor,
                  cursor: "pointer",
                  color: theme.palette.cta.main,
                },
                paddingTop: 2,
                paddingBottom: 2,
              }}
            >
              {React.cloneElement(item.icon, {
                sx: { fontSize: "30px", color: "inherit" },
              })}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: "inherit",
                  fontFamily: "Inter",
                  fontSize: "17px",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}

          {/* Logout */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              paddingLeft: 4,
              color: "white",
              "&:hover": {
                bgcolor: theme.palette.background.hovercolor,
                cursor: "pointer",
                color: theme.palette.cta.main,
              },
              paddingTop: 2,
              paddingBottom: 2,
            }}
            onClick={handleLogout}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "inherit",
                fontFamily: "Inter",
                fontSize: "17px",
              }}
            >
              LOGOUT
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Sidebar;
