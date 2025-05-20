import "./App.css";
import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Allassignment from "./pages/Assignmentviewpage";
import Loginpage from "./pages/Loginpage";
import Messages from "./pages/Messages";
import ProfilePage from "./pages/ProfilePage";
import Request from "./pages/Request";
import Signuppage from "./pages/Signuppage";
import Reviewedassignment from "./pages/Reviewedassignment";
import Pendingassignment from "./pages/Pendingassignment";
import AssignmentToOpen from "./pages/Assignmentopen";
import Groupcard from "./components/Groupcard";
import Allgroups from "./pages/Mygroups";
import CreateAssignmentForm from "./pages/Createassignment";
import GroupToOpen from "./pages/GroupInformation";
import AssignmentViewForReviewer from "./pages/AssignmentViewForReviewer";
import { useState , axios , useEffect } from "react";

// Optional: from your context or auth logic
// import { AuthContext } from "./context/AuthContext"; 

function App() {
  // const { userdata } = useContext(AuthContext); 
 const [userdata, setUserdata] = useState(null);
async function extractallinfo() {
    try {
      const response = await axios.get("/profile/user", {
        withCredentials: true,
      });
      const _id = response.data.basicUserInfo._id;
      setUserdata(response.data.basicUserInfo);

    } catch (error) {
      console.error("Error fetching the assignments:", error);
    }
  }

  useEffect(() => {
    extractallinfo();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/user/login" element={<Loginpage />} />
        <Route path="/user/signup" element={<Signuppage />} />
        <Route path="/profile/user" element={<ProfilePage />} />
        <Route
          path="/assignment/allassignment"
          element={
            userdata?.role === "reviewee" ? (
              <Allassignment />
            ) : (
              <AssignmentViewForReviewer />
            )
          }
        />
        <Route path="/assignment/reviewedassignment" element={<Reviewedassignment />} />
        <Route path="/assignment/pendingassignment" element={<Pendingassignment />} />
        <Route path="/assignment/selectedassignment/:id" element={<AssignmentToOpen />} />
        <Route path="/group/particulargroup" element={<GroupToOpen />} />
        <Route path="/group/mygroup" element={<Allgroups />} />
        <Route path="/requests" element={<Request />} />
        <Route path="/createassignment" element={<CreateAssignmentForm />} />
      </Routes>
    </>
  );
}

export default App;
