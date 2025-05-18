import "./App.css";
import React from "react";
import { Route ,Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Assignmentviewpage from "./pages/Assignmentviewpage";
import Loginpage from "./pages/Loginpage";
import Messages from "./pages/Messages";
import ProfilePage from "./pages/ProfilePage";
import Request from "./pages/Request";
import Signuppage from "./pages/Signuppage";
function App() {
  return (
    <>
    <Routes>
      <Route path="/user/login" element={<Loginpage/>}></Route>
      <Route path="/user/signup" element={<Signuppage/>}></Route>
      <Route path="/home" element={<Homepage/>}></Route>
      <Route path="/profile/user" element={<ProfilePage/>}></Route>
      <Route path="/assignmentview" element={<Assignmentviewpage/>}></Route>
    </Routes>
      </>
  );
}

export default App;
