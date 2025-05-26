import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./NotificationPanel.css";
import { getFollowersNotFollowedBack } from "../../services/followService";
import { followUser } from "../../services/userService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
function NotificationPanel({ onClose }) {
  const panelRef = useRef();
  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setLoadingRequests(true);
    getFollowersNotFollowedBack(userId)
      .then((data) => setRequests(data))
      .catch(() => setRequests([]))
      .finally(() => setLoadingRequests(false));
  }, []);

  const handleAccept = async (user) => {
    const currentUserId = localStorage.getItem("userId");
    try {
      await followUser(currentUserId, user.userId);
      toast.success(`Đã theo dõi ${user.username}`);
      setRequests((prev) => prev.filter((u) => u.userId !== user.userId));
    } catch (err) {
      toast.error("Theo dõi thất bại!", err.message);
    }
  };

  return (
    <div className="notification-panel slide-in" ref={panelRef}>
      <div className="notification-header">
        <h2>Thông báo</h2>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="notification-section follow-request">
        <div
          className="section-title follow-request-title"
          onClick={() => setShowRequests((open) => !open)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Yêu cầu theo dõi</span>
          <span style={{ fontWeight: 600, color: "#3897f0", marginLeft: 8 }}>
            {requests.length > 0 ? requests.length : ""} người
          </span>
          <span
            style={{
              marginLeft: 10,
              transition: "transform 0.2s",
              transform: showRequests ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ▶
          </span>
        </div>
        {showRequests &&
          (loadingRequests ? (
            <div className="notification-empty">Đang tải...</div>
          ) : requests.length === 0 ? (
            <div className="notification-empty">Không có yêu cầu nào.</div>
          ) : (
            <ul className="notification-list">
              {requests.map((user) => (
                <li
                  key={user.userId}
                  className="notification-list-item follow-request-item"
                >
                  <img
                    src={user.profilePictureUrl}
                    alt={user.username}
                    className="notification-avatar"
                  />
                  <div className="notification-user-info">
                    <span className="notification-username">
                      <Link
                        to={`/user/${user.username}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {user.username}
                      </Link>
                    </span>
                    <span className="notification-name">{user.fullName}</span>
                  </div>
                  <button
                    className="accept-btn"
                    onClick={() => handleAccept(user)}
                  >
                    Chấp nhận
                  </button>
                  <button className="decline-btn">Từ chối</button>
                </li>
              ))}
            </ul>
          ))}
      </div>
      <div className="notification-section normal">
        <div className="section-title">Tuần này</div>
        <div className="notification-empty">Không có thông báo nào.</div>
      </div>
    </div>
  );
}

export default NotificationPanel;
