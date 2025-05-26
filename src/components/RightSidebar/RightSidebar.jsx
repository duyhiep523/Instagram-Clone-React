import React, { useEffect, useState } from "react";
import "./RightSidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { getUserByUsername } from "../../services/userService";
import { getSuggestedFriends } from "../../services/suggestService"; // import API mới

import { logout } from "../../services/authService";

const RightSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState([]);
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    getUserByUsername(username)
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (!userId) return;
    setLoadingSuggested(true);
    getSuggestedFriends(userId)
      .then(data => setSuggested(data))
      .catch(() => setSuggested([]))
      .finally(() => setLoadingSuggested(false));
  }, [userId]);

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
        {loadingSuggested ? (
          <div style={{ textAlign: 'center', color: '#aaa', fontStyle: 'italic', margin: '12px 0' }}>Đang tải...</div>
        ) : suggested.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#aaa', fontStyle: 'italic', margin: '12px 0' }}>Không có gợi ý bạn chung</div>
        ) : (
          suggested.map((s, index) => (
            <div key={s.userId || index} className="suggestion-item">
              <Link to={`/user/${s.username}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={s.profilePictureUrl} alt={s.username} className="avatar" />
                <div>
                  <div className="username">{s.username}</div>
                  <div className="note">{s.fullName}</div>
                </div>
              </Link>
              <a href="#" className="follow-btn">
                Theo dõi
              </a>
            </div>
          ))
        )}
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
