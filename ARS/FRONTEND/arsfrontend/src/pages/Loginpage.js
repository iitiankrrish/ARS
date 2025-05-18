import Loginform from "../components/Loginform";
import { Box, Typography, Button, Divider } from "@mui/material";
function Loginpage() {
    return ( <>
    <Box sx={{display: "flex" , alignItems:"center" , justifyContent: "center" , backgroundColor: "#121212" , height: "100vh"}}>
    <Loginform/>
    </Box>
    </> );
}

export default Loginpage;