import "./App.css";
import React from "react";
import { Route ,Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Allassignment from "./pages/Assignmentviewpage";
import Loginpage from "./pages/Loginpage";
import Messages from "./pages/Messages";
import ProfilePage from "./pages/ProfilePage";
import Request from "./pages/Request";
import Signuppage from "./pages/Signuppage";
import Reviewedassignment from './pages/Reviewedassignment';
import Pendingassignment from "./pages/Pendingassignment";
import AssignmentToOpen from './pages/Assignmentopen';
import Groupcard from "./components/Groupcard";
import Allgroups from './pages/Mygroups'
function App() {
  return (
    <>
    <Routes>
      <Route path="/user/login" element={<Loginpage/>}></Route>
      <Route path="/user/signup" element={<Signuppage/>}></Route>
      {/* <Route path="/home" element={<Homepage/>}></Route> */}
      <Route path="/profile/user" element={<ProfilePage/>}></Route>
      {/* <Route path="/assignmentview" element={<Assignmentviewpage/>}></Route> */}
      <Route path="/assignment/reviewedassignment" element={<Reviewedassignment/>}></Route> 
       {/* //This is the home page */}
      <Route path="/assignment/allassignment" element={<Allassignment/>}></Route>
      <Route path="/assignment/pendingassignment" element={<Pendingassignment/>}></Route>
      <Route path="/assignment/selectedassignment/:id" element={<AssignmentToOpen/>}></Route>
      <Route path="/group/mygroup" element={<Allgroups />}></Route>
    </Routes>
      </>
  );
}

export default App;
