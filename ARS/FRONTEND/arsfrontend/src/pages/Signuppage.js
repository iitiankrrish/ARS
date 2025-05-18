import SignUpComponent from "../components/SignUpComponent";
import { Box, Typography, Button, Divider } from "@mui/material";
function Signuppage() {
    return ( <>
    <Box sx={{display: "flex" , alignItems:"center" , justifyContent: "center" , backgroundColor: "#121212" , height: "100vh"}}>
    <SignUpComponent/>
    </Box>
    </> );
}

export default Signuppage;