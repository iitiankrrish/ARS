import "@fontsource/inter/900.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/500.css";
import GoogleIcon from "@mui/icons-material/Google";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Typography, Button, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";

import {
  CenterFocusStrong,
  FamilyRestroom,
  ForkLeft,
} from "@mui/icons-material";
function Loginform() {
  const theme = createTheme({
    palette: {
      background: {
        main: "#1e1e1e",
        selectcolor: "#2c2c2c",
      },
      cta: {
        main: "#ff8c00",
        maintext: "#fff",
      },
    },
  });
  return (
    <>
      <Box
        sx={{ width: 700, height: 500, bgcolor: theme.palette.background.main }}
      >
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: 40,
            fontWeight: 700,
            color: theme.palette.cta.maintext,
            textAlign: "center",
            paddingTop: 2,
          }}
        >
          LOGIN
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            id="outlined"
            label="Email ID"
            placeholder="examplemail123@gmail.com"
            sx={{
              width: 500,
              marginTop: 3.5,

              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ff8c00", // default border
                },
                "&:hover fieldset": {
                  borderColor: "#ffa733", // hover border
                },
                "&.Mui-focused": {
                  backgroundColor: "#2c2c2c", // background on focus on the input container
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff8c00", // focus border color
                },
                "& input::placeholder": {
                  color: "#cccccc", // placeholder color
                  opacity: 1,
                },
                "& input": {
                  color: "#fff", // make sure input text is visible on dark bg
                },
              },

              "& label": {
                color: "#ff8c00", // default label
              },
              "& label.Mui-focused": {
                color: "#ff8c00", // focused label
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
          <TextField
            id="outlined"
            label="Phone"
            slotProps={{
              input: {
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 10
              },
            }}
            placeholder="xxxxxxxxxx"
            sx={{
              width: 230,
              marginTop: 5,

              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ff8c00", // default border
                },
                "&:hover fieldset": {
                  borderColor: "#ffa733", // hover border
                },
                "&.Mui-focused": {
                  backgroundColor: "#2c2c2c", // background on focus on the input container
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff8c00", // focus border color
                },
                "& input::placeholder": {
                  color: "#cccccc", // placeholder color
                  opacity: 1,
                },
                "& input": {
                  color: "#fff", // make sure input text is visible on dark bg
                },
              },

              "& label": {
                color: "#ff8c00", // default label
              },
              "& label.Mui-focused": {
                color: "#ff8c00", // focused label
              },
            }}
          />
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            // autoComplete="current-password"
            sx={{
              width: 230,
              marginTop: 5,

              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ff8c00", // default border
                },
                "&:hover fieldset": {
                  borderColor: "#ffa733", // hover border
                },
                "&.Mui-focused": {
                  backgroundColor: "#2c2c2c", // background on focus on the input container
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff8c00", // focus border color
                },
                "& input::placeholder": {
                  color: "#cccccc", // placeholder color
                  opacity: 1,
                },
                "& input": {
                  color: "#fff", // make sure input text is visible on dark bg
                },
              },

              "& label": {
                color: "#ff8c00", // default label
              },
              "& label.Mui-focused": {
                color: "#ff8c00", // focused label
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "inline-flex",
            marginLeft: 14,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: theme.palette.cta.main,
              height: 35,
              fontWeight: 700,
              fontFamily: "Inter",
              fontSize: 17,
              marginTop: 6,
              color: theme.palette.background.main,
            }}
          >
            LOGIN
          </Button>
          <Divider
            sx={{
              borderBottomColor: "#ffffff",
              marginTop: 5,
              width: 480,
              textAlign: "center",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            startIcon={<GoogleIcon />}
            variant="outlined"
            sx={{
              fontWeight: 700,
              fontFamily: "Inter",
              fontSize: 17,
              color: "#ffffff",
              border: "1.5px solid #ff8c00",
              "&:hover": {
                bgcolor: "#ff8c00",
                color: theme.palette.background.main,
              },
              marginTop: 4,
            }}
          >
            LOGIN THROUGH GOOGLE
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default Loginform;
