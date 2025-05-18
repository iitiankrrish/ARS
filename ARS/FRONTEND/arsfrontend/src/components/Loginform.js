import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import "@fontsource/inter/900.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/500.css";
import GoogleIcon from "@mui/icons-material/Google";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Typography, Button, Divider, Fade } from "@mui/material";
import TextField from "@mui/material/TextField";

function Loginform() {
  const navigate = useNavigate();

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

  const [form, setform] = useState({
    email: "",
    phoneNumber: "",
    password: "",
  });

  const checkforlogindetails = async () => {
    try {
      console.log(form);
      const response = await axios.post("/user/login", form);
      const successMessage = response.data.Success;
      setstate({ ...state, open: true, message: successMessage });
      console.log(response);
      navigate("/profile/user");
    } catch (error) {
      console.log(error.response);
      setstate({ ...state, open: true, message: error.response.data.Error });
    }
  };

  const valueonchange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };
  const [state, setstate] = useState({
    open: false,
    message: "",
    Transition: Fade,
  });
  const handleSnackbarClose = () => {
    setstate({ ...state, open: false });
  };
  return (
    <ThemeProvider theme={theme}>
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
        <Snackbar
          open={state.open}
          onClose={handleSnackbarClose}
          message={state.message}
          key={state.Transition.name}
          autoHideDuration={3000}
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            id="outlined"
            label="Email ID"
            name="email"
            value={form.email}
            onChange={valueonchange}
            placeholder="examplemail123@gmail.com"
            sx={textfieldStyles}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
          <TextField
            id="outlined"
            label="Phone"
            value={form.phoneNumber}
            onChange={valueonchange}
            name="phoneNumber"
            placeholder="xxxxxxxxxx"
            sx={textfieldStyles}
          />
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            value={form.password}
            onChange={valueonchange}
            name="password"
            sx={textfieldStyles}
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
            onClick={checkforlogindetails}
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
    </ThemeProvider>
  );
}

// Reusable style object to reduce duplication
const textfieldStyles = {
  width: 230,
  marginTop: 5,
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ff8c00",
    },
    "&:hover fieldset": {
      borderColor: "#ffa733",
    },
    "&.Mui-focused": {
      backgroundColor: "#2c2c2c",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff8c00",
    },
    "& input::placeholder": {
      color: "#cccccc",
      opacity: 1,
    },
    "& input": {
      color: "#fff",
    },
  },
  "& label": {
    color: "#ff8c00",
  },
  "& label.Mui-focused": {
    color: "#ff8c00",
  },
};

export default Loginform;
