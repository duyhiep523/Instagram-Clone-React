import React, { useEffect, useState } from "react";
import "./RightSidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { getUserByUsername } from "../../services/userService";
const suggestions = [
  {
    username: "instagram",
    note: "có 1,2 triệu người theo dõi",
    avatar:
      "https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png",
  },
  {
    username: "dung.281t1",
    note: "Có themzah.8836 theo dõi",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    username: "punch._.ahihi",
    note: "Có minh.hoag_710 theo dõi",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    username: "hgg.flm",
    note: "Gợi ý cho bạn",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    username: "hgiangg_49",
    note: "Có 2 người khác theo dõi",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

import { logout } from "../../services/authService";

const RightSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    getUserByUsername(username)
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [username]);

  return (
    <div className="right-sidebar">
      <div className="current-user">
        {loading ? (
          <div>Đang tải...</div>
        ) : user ? (
          <>
            <img
              src={user.profilePictureUrl || "https://i.pravatar.cc/150?img=5"}
              alt={user.username}
              className="avatar"
            />
            <div>
              <div className="username">
                <Link
                  to="/profile"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  {user.username}
                </Link>
              </div>
              <div className="fullname">{user.fullName}</div>
            </div>
            <span className="switch-btn" onClick={handleLogout} style={{cursor: "pointer"}}>Chuyển</span>
          </>
        ) : (
          <div>Lỗi tải thông tin</div>
        )}
      </div>

      <div className="suggestions-header">
        <span>Gợi ý cho bạn</span>
        <a href="#">Xem tất cả</a>
      </div>

      <div className="suggestions-list">
        {suggestions.map((s, index) => (
          <div key={index} className="suggestion-item">
            <img src={s.avatar} alt={s.username} className="avatar" />
            <div>
              <div className="username">{s.username}</div>
              <div className="note">{s.note}</div>
            </div>
            <a href="#" className="follow-btn">
              Theo dõi
            </a>
          </div>
        ))}
      </div>

      <div className="footer">
        <p>Giới thiệu • Trợ giúp • API • Việc làm</p>
        <p>Quyền riêng tư • Điều khoản • Vị trí • Ngôn ngữ</p>
        <p>Meta đã xác minh</p>
        <p>© 2025 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};

export default RightSidebar;
