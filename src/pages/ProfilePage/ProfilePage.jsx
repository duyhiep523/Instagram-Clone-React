import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserProfile from "../../components/UserProfile/UserProfile";
import "./ProfilePage.css";
const ProfilePage = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{<UserProfile />}</div>
      <div className="main-right">
        {/* <p>ben phai</p> */}
      </div>
    </div>
  );
};

export default ProfilePage;
