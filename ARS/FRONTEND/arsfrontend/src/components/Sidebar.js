import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import "@fontsource/inter/900.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/700.css";

// import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import Divider from "@mui/material/Divider";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AlternateEmail, CheckCircleOutline, Email, GroupAdd, HelpOutline, Home, HomeFilled, People, PersonOutline } from "@mui/icons-material";

function Sidebar() {
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

  return (
    <>
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
              KRRISH
            </Typography>
          </Box>

          <Divider
            sx={{
              borderColor: theme.palette.cta.contrastText,
              borderBottomWidth: 1,
              paddingTop: 2,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",

              marginTop: 2,
              //   marginLeft: 5,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                // marginBottom: 2,
                gap: "10px",
                paddingLeft: 4,
                color: "white", // default text color here
                "&:hover": {
                  bgcolor: theme.palette.background.hovercolor,
                  cursor: "pointer",
                  color: theme.palette.cta.main, // text color on hover
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
                  marginLeft: "4px",
                  fontSize: "17px",
                }}
              >
                HOME
              </Typography>
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                // marginBottom: 2,
                gap: "10px",
                paddingLeft: 4,
                color: "white", // default text color here
                "&:hover": {
                  bgcolor: theme.palette.background.hovercolor,
                  cursor: "pointer",
                  color: theme.palette.cta.main, // text color on hover
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
                  marginLeft: "4px",
                  fontSize: "17px",
                }}
              >
                REVIEWED
              </Typography>
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                // marginBottom: 2,
                gap: "10px",
                paddingLeft: 4,
                color: "white", // default text color here
                "&:hover": {
                  bgcolor: theme.palette.background.hovercolor,
                  cursor: "pointer",
                  color: theme.palette.cta.main, // text color on hover
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
                  marginLeft: "4px",
                  fontSize: "17px",
                }}
              >
                UNREVIEWED
              </Typography>
            </Box>
           <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                // marginBottom: 2,
                gap: "10px",
                paddingLeft: 4,
                color: "white", // default text color here
                "&:hover": {
                  bgcolor: theme.palette.background.hovercolor,
                  cursor: "pointer",
                  color: theme.palette.cta.main, // text color on hover
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
                  marginLeft: "4px",
                  fontSize: "17px",
                }}
              >
                MESSAGES
              </Typography>
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                // marginBottom: 2,
                gap: "10px",
                paddingLeft: 4,
                color: "white", // default text color here
                "&:hover": {
                  bgcolor: theme.palette.background.hovercolor,
                  cursor: "pointer",
                  color: theme.palette.cta.main, // text color on hover
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
                  marginLeft: "4px",
                  fontSize: "17px",
                }}
              >
                VIEW PROFILE
              </Typography>
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                // marginBottom: 2,
                gap: "10px",
                paddingLeft: 4,
                color: "white", // default text color here
                "&:hover": {
                  bgcolor: theme.palette.background.hovercolor,
                  cursor: "pointer",
                  color: theme.palette.cta.main, // text color on hover
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
                  marginLeft: "4px",
                  fontSize: "17px",
                }}
              >
                REQUESTS
              </Typography>
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                // marginBottom: 2,
                gap: "10px",
                paddingLeft: 4,
                color: "white", // default text color here
                "&:hover": {
                  bgcolor: theme.palette.background.hovercolor,
                  cursor: "pointer",
                  color: theme.palette.cta.main, // text color on hover
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
                  marginLeft: "4px",
                  fontSize: "17px",
                }}
              >
                CREATE GROUP
              </Typography>
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                // marginBottom: 2,
                gap: "10px",
                paddingLeft: 4,
                color: "white", // default text color here
                "&:hover": {
                  bgcolor: theme.palette.background.hovercolor,
                  cursor: "pointer",
                  color: theme.palette.cta.main, // text color on hover
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
                  marginLeft: "4px",
                  fontSize: "17px",
                }}
              >
                JOIN GROUP
              </Typography>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default Sidebar;
