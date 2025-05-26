import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import OtherUserProfile from "../../components/UserProfile/OtherUserProfile";
import { useParams } from "react-router-dom";
import "./ProfilePage.css";

export default function OtherUserProfilePage() {
  const { username } = useParams();
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <OtherUserProfile username={username} />
      </div>
      <div className="main-right">
        {/* Có thể thêm nội dung bên phải nếu muốn */}
      </div>
    </div>
  );
}
