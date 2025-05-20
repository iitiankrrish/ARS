import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  ThemeProvider,
  createTheme,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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

  // Dialog open state here
  const [open, setOpen] = useState(false);
const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setformval("");
  };
  const handleLogout = async () => {
    try {
      const res = await axios.post("/user/logout", {}, { withCredentials: true });
      console.log("Logout successful:", res);
      navigate("/user/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleMyGroup = () => {
    try {
      console.log("Switched to my groups");
      navigate("/group/mygroup");
    } catch (err) {
      console.log(err);
    }
  };

  const allAssignmentClick = () => {
    try {
      navigate("/assignment/allassignment");
      console.log("Switched to all assignments page");
    } catch (err) {
      console.log(err);
    }
  };
  const handlerequest= () => {
    try {
      navigate("/requests");
      console.log("Switched to request page");
    } catch (err) {
      console.log(err);
    }
  };
  const viewProfileChange = () => {
    try {
      navigate("/profile/user");
      console.log("Switched to profile page");
    } catch (err) {
      console.log(err);
    }
  };

  const pendingAssignmentClick = () => {
    try {
      navigate("/assignment/pendingassignment");
      console.log("Switched to pending assignments page");
    } catch (err) {
      console.log(err);
    }
  };

  const acceptedAssignmentClick = () => {
    try {
      navigate("/assignment/reviewedassignment");
      console.log("Switched to reviewed assignments page");
    } catch (err) {
      console.log(err);
    }
  };

  
  const [formval, setformval] = useState(0);

  const handleJoining = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/group/join/${formval}`);
      console.log(response.data);
      alert("successfully added to group");
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };
  const handleOnChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setformval(value); // Only allow numeric values
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          wordBreak: "break-word",
          whiteSpace: "normal",
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
            onClick={allAssignmentClick}
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
            onClick={acceptedAssignmentClick}
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

          {/* PENDING */}
          <Box
            onClick={pendingAssignmentClick}
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
            onClick={viewProfileChange}
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
            onClick = {handlerequest}
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

          {/* MY GROUP */}
          <Box
            onClick={handleMyGroup}
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
            onClick={handleOpen}
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

          {/* LOGOUT */}
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

        {/* JOIN GROUP DIALOG */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Join Group</DialogTitle>
          <form onSubmit={handleJoining}>
            <DialogContent>
              <TextField
                label="Enter Group ID"
                type="text"
                value={formval}
                onChange={handleOnChange}
                fullWidth
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="cta">
                Join
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default Sidebar;
