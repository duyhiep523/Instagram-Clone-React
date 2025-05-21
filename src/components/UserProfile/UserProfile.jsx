import React, { useEffect, useState } from "react";
import "./UserProfile.css"; // Import tệp CSS
import { Link } from "react-router-dom"; 
import UserProfileContent from "./UserProfileContent"; // Import nội dung bài viết
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons"; // Sử dụng icon đánh dấu trang
import { faUserTag } from "@fortawesome/free-solid-svg-icons"; // Sử dụng icon người được gắn thẻ
import { Plus } from "react-feather";
import HighlightFriend from "../Highlight/HighlightFriend";
import HighlightList from "../Highlight/HighlightList";
import { getUserByUsername } from "../../services/userService";


function UserProfile() {
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

  if (loading) {
    return <div className="user-profile-header"><div>Đang tải thông tin...</div></div>;
  }
  if (!user) {
    return <div className="user-profile-header"><div>Lỗi tải thông tin người dùng</div></div>;
  }

  return (
    <div className="user-profile-header">
      <div>
        <div className="profile-info-top">
          <div className="avatar-container">
            <div className="avatar" style={{width: "160px", height: "160px"}}>
              <img
                src={user.profilePictureUrl || "https://i.pravatar.cc/150?img=5"}
                alt="Avatar"
              />
            </div>
          </div>
          <div className="user-details">
            <div className="username-row">
              <div className="username-row-item">
                <p className="username">{user.username}</p>
              </div>
              <div className="username-row-item">
                <button className="edit-profile">
                  <Link to="/profile-edit" style={{ textDecoration: 'none',color:'white' }} >
                    <p>Chỉnh sửa trang cá nhân</p>
                  </Link>
                </button>
              </div>
              <div className="username-row-item">
                <button className="view-saved">Xem kho lưu trữ</button>
              </div>
              <div className="username-row-item">
                <FontAwesomeIcon icon={faGear} />
              </div>
            </div>

            <div className="user-bio">
              <span className="name">{user.fullName}</span>
            </div>

            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-number">{user.postsCount ?? 0}</span>{" "}
                <span className="text-grey">bài viết</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.followersCount ?? 0}</span>{" "}
                <span className="text-grey">người theo dõi</span>
              </div>
              <div className="stat-item">
                <span className="text-grey">Đang theo dõi</span>{" "}
                <span className="stat-number">{user.followingCount ?? 0}</span>{" "}
                <span className="text-grey">người dùng</span>
              </div>
            </div>

            <div className="bio-main">
              Giới thiệu
              <p>{user.bio || ""}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="highlight-container">
        <HighlightList />
      </div>

      {/* Phần điều hướng bài viết, đã lưu, được gắn thẻ */}
      <div className="profile-navigation">
        <div className="nav-item active">
          <p className="nav-icon">
            <FontAwesomeIcon icon={faTableCellsLarge} />{" "}
          </p>
          <p>BÀI VIẾT</p>
        </div>
        <div className="nav-item">
          <div className="nav-icon">
            <FontAwesomeIcon icon={faBookmark} />
          </div>
          <div>
            <p>ĐÃ LƯU</p>
          </div>
        </div>
        <div className="nav-item">
          <p className="nav-icon">
            <FontAwesomeIcon icon={faUserTag} />{" "}
          </p>
          <p>ĐƯỢC GẮN THẺ</p>
        </div>

      </div>
        <div className="list-post">
          <UserProfileContent />
        </div>
    </div>
  );
}

export default UserProfile;
