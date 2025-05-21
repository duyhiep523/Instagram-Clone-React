import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import EditProfile from "../../components/EditProfile/EditProfile";
import "./ProfileEditPage.css";
const ProfileEditPage = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{<EditProfile />}</div>
      <div className="main-right">
        {/* <p>ben phai</p> */}
      </div>
    </div>
  );
};

export default ProfileEditPage;
