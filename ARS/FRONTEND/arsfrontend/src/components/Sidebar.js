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
      const res = await axios.post(
        "/user/logout",
        {},
        { withCredentials: true }
      );
      console.log("Logout successful:", res);
      navigate("/user/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const handlemygroup = async () => {
    try {
      console.log("Switched to my groups");
      navigate("/group/mygroup"); // Redirect to login page
    } catch (err) {
      console.log(err);
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
  const allassignmentclick = () => {
    try {
      navigate("/assignment/allassignment");
      console.log("switched to all assignments page");
    } catch (err) {
      console.log(err);
    }
  };
  const viewprofilechange = () => {
    try {
      navigate("/profile/user");
      console.log("switched to all assignments page");
    } catch (err) {
      console.log(err);
    }
  };
  const pendingassignmentclick = () => {
    try {
      navigate("/assignment/pendingassignment");
      console.log("switched to all assignments page");
    } catch (err) {
      console.log(err);
    }
  };
  const accepetedassignmentclick = () => {
    try {
      navigate("/assignment/reviewedassignment");
      console.log("switched to all assignments page");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          wordBreak: "break-word", // or "break-all"
          whiteSpace: "normal", // allows wrapping
          width: "300px",
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
          {/* HOME */}
          <Box
            onClick={allassignmentclick}
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
            <HomeFilled sx={{ fontSize: "30px", color: "inherit" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "inherit",
                fontFamily: "Inter",
                fontSize: "17px",
              }}
            >
              HOME
            </Typography>
          </Box>

          {/* REVIEWED */}
          <Box
            onClick={accepetedassignmentclick}
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
            <CheckCircleOutline sx={{ fontSize: "30px", color: "inherit" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "inherit",
                fontFamily: "Inter",
                fontSize: "17px",
              }}
            >
              REVIEWED
            </Typography>
          </Box>

          {/* UNREVIEWED */}
          <Box
            onClick={pendingassignmentclick}
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
            <HelpOutline sx={{ fontSize: "30px", color: "inherit" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "inherit",
                fontFamily: "Inter",
                fontSize: "17px",
              }}
            >
              PENDING
            </Typography>
          </Box>

          {/* MESSAGES */}
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
          >
            <Email sx={{ fontSize: "30px", color: "inherit" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "inherit",
                fontFamily: "Inter",
                fontSize: "17px",
              }}
            >
              MESSAGES
            </Typography>
          </Box>

          {/* VIEW PROFILE */}
          <Box
            onClick={viewprofilechange}
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
            <PersonOutline sx={{ fontSize: "30px", color: "inherit" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "inherit",
                fontFamily: "Inter",
                fontSize: "17px",
              }}
            >
              VIEW PROFILE
            </Typography>
          </Box>

          {/* REQUESTS */}
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
          >
            <AlternateEmail sx={{ fontSize: "30px", color: "inherit" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "inherit",
                fontFamily: "Inter",
                fontSize: "17px",
              }}
            >
              REQUESTS
            </Typography>
          </Box>

          {/* CREATE GROUP */}
          <Box
            onClick={handlemygroup} // ✅ Correct: attach onClick to the whole Box
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
            <People sx={{ fontSize: "30px", color: "inherit" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "inherit",
                fontFamily: "Inter",
                fontSize: "17px",
              }}
            >
              MY GROUP
            </Typography>
          </Box>

          {/* JOIN GROUP */}
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
          >
            <GroupAdd sx={{ fontSize: "30px", color: "inherit" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "inherit",
                fontFamily: "Inter",
                fontSize: "17px",
              }}
            >
              JOIN GROUP
            </Typography>
          </Box>

          {/* LOGOUT (already present below, keep as is) */}
        </Box>

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
    </ThemeProvider>
  );
}

export default Sidebar;
