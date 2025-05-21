import React, { useState } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCompass } from "@fortawesome/free-regular-svg-icons";
import { faFilm } from "@fortawesome/free-solid-svg-icons";

import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import CreatePostModal from "../Post/CreatePostModal";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SearchPanel from "../SearchPanel/SearchPanel";
import NotificationPanel from "../NotificationPanel/NotificationPanel";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  const items = [
    { key: "home", label: "Trang chủ", icon: faHouse, onClick: () => { setActive("home"); navigate("/home"); } },
    { key: "search", label: "Tìm kiếm", icon: faMagnifyingGlass, onClick: () => { setShowSearch(true); setActive("search"); } },
    { key: "explore", label: "Khám phá", icon: faCompass, onClick: () => setActive("explore") },
    { key: "reels", label: "Reels", icon: faFilm, onClick: () => setActive("reels") },
    { key: "message", label: "Tin nhắn", icon: faFacebookMessenger, onClick: () => setActive("message") },
    { key: "notify", label: "Thông báo", icon: faHeart, onClick: () => { setShowNotify(true); setActive("notify"); } },
    { key: "create", label: "Tạo", icon: faSquarePlus, onClick: () => { setShowCreatePost(true); setActive("create"); } },
    { key: "more", label: "Xem thêm", icon: faBars, onClick: () => setActive("more") },
  ];

  return (
    <nav>
      <div>
        <div className="logo-insta">
          <p style={{cursor: 'pointer'}} onClick={() => navigate('/home')}>instagram</p>
        </div>
      </div>
      <div className="sidebar">
        {items.map(item => (
          <div
            key={item.key}
            className={`sidebar-item${active === item.key ? " active" : ""}`}
            onClick={item.onClick}
            title={item.label}
          >
            <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
            <p className="sidebar-label">{item.label}</p>
          </div>
        ))}
        <div className="sidebar-item sidebar-item-more">
          {/* Để dành cho các menu phụ nếu muốn */}
        </div>
      </div>
      {showSearch && (
        <div className="search-panel-container">
          <SearchPanel onClose={() => setShowSearch(false)} />
        </div>
      )}
      {showNotify && (
        <div className="search-panel-container">
          <NotificationPanel onClose={() => setShowNotify(false)} />
        </div>
      )}
      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} />
      )}
    </nav>
  );
}

export default Sidebar;
