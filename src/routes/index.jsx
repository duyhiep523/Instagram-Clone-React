import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LoginPage/LoginPage";
import Register from "../pages/RegisterPage/RegisterPage";
import HomePage from "../pages/HomePage/HomePage";
import PostView from "../pages/Post/PostView";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import OtherUserProfilePage from "../pages/ProfilePage/OtherUserProfilePage";
import { StoryPage } from "../pages/StoryPage/StoryPage";
import ProfileEditPage from "../pages/ProfilePage/ProfileEditPage";
import ProtectedRoute from "./ProtectedRoute";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/posview" element={<ProtectedRoute><PostView /></ProtectedRoute>} />
      <Route path="/stories" element={<ProtectedRoute><StoryPage /></ProtectedRoute>} />
      <Route path="/profile-edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
      <Route path="/user/:username" element={<ProtectedRoute><OtherUserProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
