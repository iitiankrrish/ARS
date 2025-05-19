import Typography from "@mui/material/Typography";
import "@fontsource/inter/900.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/700.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Source } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Groupcard({ groupname, groupid, captainid, memberlength, creator }) {
  const [creatorname, setcreatorname] = useState("");
  const [captainname, setcaptainname] = useState("");
  const [groupinfo, setgroupinfo] = useState(null);
  const navigate = useNavigate();

  // Fetch Creator Name
  useEffect(() => {
    const fetchCreator = async () => {
      if (!creator) return;
      try {
        const res = await axios.post(`/user/getuserbyid/${creator}`);
        if (res.data?.name) {
          setcreatorname(res.data.name);
          console.log("Creator name fetched:", res.data.name);
        }
      } catch (err) {
        console.error("Error fetching creator:", err);
      }
    };
    fetchCreator();
  }, [creator]);

  // Fetch Captain Name
  useEffect(() => {
    const fetchCaptain = async () => {
      if (!captainid) return;
      try {
        const res = await axios.post(`/user/getuserbyid/${captainid}`);
        if (res.data?.name) {
          setcaptainname(res.data.name);
          console.log("Captain name fetched:", res.data.name);
        }
      } catch (err) {
        console.error("Error fetching captain:", err);
      }
    };
    fetchCaptain();
  }, [captainid]);

  // Fetch Group Info
  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupid || !groupname) return;
      try {
        const res = await axios.post(`/group/find/${groupid}/${groupname}`);
        if (res.data) {
          setgroupinfo(res.data);
          console.log("Group info fetched:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch group info:", err);
      }
    };
    fetchGroupInfo();
  }, [groupid, groupname]);

  // Handle Group View Navigation
  const handlegroupview = () => {
    if (groupinfo && groupinfo._id) {
      localStorage.setItem("groupinfo", JSON.stringify(groupinfo));
      console.log("Group info saved to localStorage");
      navigate(`/group/particulargroup`);
    } else {
      console.error("Group info not loaded yet");
    }
  };

  const theme = createTheme({
    palette: {
      background: {
        sidebarbg: "#161412",
        hovercolor: "#1e1e1e",
      },
      cta: {
        main: "#ff8c00",
        contrastText: "#fff",
        secondaryText: "#9D9D9D",
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          width: 375,
          height: 250,
          overflow: "auto",
          resize: "horizontal",
          background:
            "radial-gradient(50% 50% at 50% 50%, #141414 0%, #050B05 100%)",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: theme.palette.cta.contrastText }}
          >
            {groupname}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: theme.palette.cta.secondaryText }}
          >
            Group Number: {groupid}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: "#7A7A7A" }}>
            Captain: {captainname || "Not assigned"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: "#7A7A7A" }}>
            Number of Members: {memberlength}
          </Typography>
        </CardContent>
        <CardActions>
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
            }}
          >
            <Button
              onClick={handlegroupview}
              startIcon={
                <Source sx={{ color: theme.palette.background.sidebarbg }} />
              }
              sx={{
                fontSize: 16,
                padding: "8px 25px",
                bgcolor: "transparent",
                color: theme.palette.cta.main,
                border: "2px solid #ff8c00",
                "&:hover": {
                  bgcolor: theme.palette.cta.main,
                  color: theme.palette.background.sidebarbg,
                },
              }}
            >
              View
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: theme.palette.cta.main,
              position: "absolute",
              bottom: 18,
            }}
          >
            Created By: {creatorname || "Unknown"}
          </Typography>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default Groupcard;
