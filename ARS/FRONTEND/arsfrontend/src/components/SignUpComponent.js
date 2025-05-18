import "@fontsource/inter/900.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/500.css";
import GoogleIcon from "@mui/icons-material/Google";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Typography, Button, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Fade from "@mui/material/Fade";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import { RepeatOneSharp } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
function SignUpComponent() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    open: false,
    message: "",
    Transition: Fade,
  });

  const [form, setform] = useState({
    email: "",
    phoneNumber: "",
    name: "",
    role: "",
    username: "",
    password: "",
  });

  const valueonchange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const SubmitSignUpForm = async () => {
    try {
      if (
        !form.email ||
        !form.password ||
        !form.name ||
        !form.role ||
        !form.username ||
        !form.phoneNumber
      ) {
        setState({
          ...state,
          open: true,
          message: "All fields are required fields",
        });
        return;
      }
      console.log(form);
      const response = await axios.post("/user/signup", form);
      const successMessage = response.data.Success;
      setState({
        ...state,
        open: true,
        message: successMessage,
      });
      console.log(response.data);
      navigate("/user/login");
    } catch (error) {
      const errorMessage = error.response.data.Error;
      setState({
        ...state,
        open: true,
        message: errorMessage,
      });
      console.log(error.response.data);
    }
  };

  const handleSnackbarClose = () => {
    setState({ ...state, open: false });
  };

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
      <Snackbar
        open={state.open}
        onClose={handleSnackbarClose}
        message={state.message}
        key={state.Transition.name}
        autoHideDuration={3000}
      />

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
          SIGN UP
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <TextField
            name="email"
            id="outlined-email"
            label="Email ID"
            onChange={valueonchange}
            value={form.email}
            placeholder="examplemail123@gmail.com"
            sx={{
              width: 215,
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
                  color: "#fff", // input text color
                },
              },

              "& label": {
                color: "#ff8c00",
              },
              "& label.Mui-focused": {
                color: "#ff8c00",
              },
            }}
          />
          <TextField
            name="phoneNumber"
            id="outlined-phone"
            label="Phone"
            placeholder="1234567890"
            onChange={valueonchange}
            value={form.phoneNumber}
            sx={{
              width: 215,
              marginTop: 3.5,

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
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
          <TextField
            name="username"
            id="outlined-username"
            onChange={valueonchange}
            value={form.username}
            label="Username"
            placeholder="john123"
            sx={{
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
            }}
          />
          <FormControl
            sx={{
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
            }}
          >
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="select-role"
              value={form.role}
              label="Role"
              name="role"
              onChange={valueonchange}
            >
              <MenuItem value="reviewer">Reviewer</MenuItem>
              <MenuItem value="reviewee">Reviewee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
          <TextField
            name="name"
            id="outlined-name"
            label="Full Name"
            onChange={valueonchange} // <-- Added this line
            value={form.name}
            placeholder="John Doe"
            sx={{
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
            }}
          />
          <TextField
            id="outlined-password-input"
            name="password"
            onChange={valueonchange}
            value={form.password}
            label="Password"
            type="password"
            sx={{
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
            onClick={SubmitSignUpForm}
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
            SIGN UP
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default SignUpComponent;
