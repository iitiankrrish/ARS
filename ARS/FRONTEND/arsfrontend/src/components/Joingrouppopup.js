import "@fontsource/inter/900.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/500.css";
import GoogleIcon from "@mui/icons-material/Google";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Typography, Button, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";

function Joingrouppopup() {
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
        sx={{ width: 650, height: 300, bgcolor: theme.palette.background.main }}
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
          JOIN GROUP
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            id="outlined"
            label="Group ID"
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
        
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            
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
          >JOIN
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default Joingrouppopup;
