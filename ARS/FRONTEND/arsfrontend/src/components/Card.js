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
import PreviewIcon from "@mui/icons-material/Preview";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Source } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
function AssgnCard({title , description , dueDate , status , id}) {
  console.log(id);
 const dateObj = new Date(dueDate);
const day = dateObj.getDate();
const month = dateObj.getMonth() + 1;
const year = dateObj.getFullYear();
const navigator = useNavigate();
const date = `${month}/${day}/${year}`;

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
  const openselectedassignment = async ()=>{
    try{
      navigator(`/assignment/selectedassignment/${id}`);
    }
    catch(error){
        console.log(error);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          // paddingBottom: 6,
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
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: theme.palette.cta.secondaryText }}
          >
            {status.toUpperCase()}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: "#7A7A7A" }}>
            {description.slice(0, 126)}...

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
              onClick={openselectedassignment}
              startIcon={
                <Source sx={{ color: "theme.palette.background.sidebarbg" }} />
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
            Due By {date}
          </Typography>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default AssgnCard;

