import React, { useEffect, useState } from "react";
import "./UserProfile.css"; // Import tệp CSS
import { Link } from "react-router-dom";
import UserProfileContent from "./UserProfileContent"; // Import nội dung bài viết
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { Plus } from "react-feather";
import HighlightList from "../Highlight/HighlightList";
import FollowersModal from "../../Modal/FollowersModal/FollowersModal"; // Import modal followers
import FollowingModal from "../../Modal/FollowingModal/FollowingModal"; // Import modal following MỚI

// Import tất cả các hàm dịch vụ cần thiết
import {
  getUserByUsername,
  getPostCountByUserId,
  getFollowersCountByUserId,
  getFollowingCountByUserId,
} from "../../services/userService";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFollowersModal, setShowFollowersModal] = useState(false); // State để điều khiển modal Followers
  const [showFollowingModal, setShowFollowingModal] = useState(false); // State MỚI để điều khiển modal Following

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      setLoading(false);
      console.error(
        "Không tìm thấy username trong localStorage. Vui lòng đăng nhập."
      );
      return;
    }

    setLoading(true);

    const fetchProfileData = async () => {
      try {
        const userData = await getUserByUsername(username);

        if (!userData || !userData.userId) {
          throw new Error("Không tìm thấy thông tin người dùng hoặc userId.");
        }

        const userId = userData.userId;

        const [postsCount, followersCount, followingCount] = await Promise.all([
          getPostCountByUserId(userId),
          getFollowersCountByUserId(userId),
          getFollowingCountByUserId(userId),
        ]);

        setUser({
          ...userData,
          stats: {
            posts: postsCount || 0,
            followers: followersCount || 0,
            following: followingCount || 0,
          },
        });
      } catch (err) {
        console.error("Lỗi khi tải thông tin hồ sơ:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  // Hàm xử lý khi click vào số followers
  const handleFollowersClick = () => {
    setShowFollowersModal(true);
  };

  // Hàm xử lý khi click vào số following (MỚI)
  const handleFollowingClick = () => {
    setShowFollowingModal(true);
  };

  // Hàm đóng modal chung (có thể dùng chung cho cả hai modal nếu bạn muốn, hoặc tạo riêng)
  const handleCloseModal = () => {
    setShowFollowersModal(false);
    setShowFollowingModal(false); // Đảm bảo đóng cả hai
  };

  if (loading) {
    return (
      <div className="user-profile-header">
        <div>Đang tải thông tin...</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="user-profile-header">
        <div>Lỗi tải thông tin người dùng</div>
      </div>
    );
  }

  const displayPosts = user.stats?.posts ?? 0;
  const displayFollowers = user.stats?.followers ?? 0;
  const displayFollowing = user.stats?.following ?? 0;

  return (
    <div className="user-profile-header">
      <div>
        <div className="profile-info-top">
          <div className="avatar-container">
            <div className="avatar" style={{ width: "160px", height: "160px" }}>
              <img
                src={
                  user.profilePictureUrl || "https://i.pravatar.cc/150?img=5"
                }
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
                  <Link
                    to="/profile-edit"
                    style={{ textDecoration: "none", color: "white" }}
                  >
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
                <span className="stat-number">{displayPosts}</span>{" "}
                <span className="text-grey">bài viết</span>
              </div>
              <div
                className="stat-item"
                style={{ cursor: "pointer" }}
                onClick={handleFollowersClick} // Mở modal Followers
              >
                <span className="stat-number">{displayFollowers}</span>{" "}
                <span className="text-grey">người theo dõi</span>
              </div>
              <div
                className="stat-item"
                style={{ cursor: "pointer" }} // Thêm cursor: pointer cho click
                onClick={handleFollowingClick} // Mở modal Following MỚI
              >
                <span className="text-grey">Đang theo dõi</span>{" "}
                <span className="stat-number">{displayFollowing}</span>{" "}
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
        <HighlightList userId={user.userId} />
      </div>

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
        <UserProfileContent userId={user.userId} />
      </div>

      {/* Modal hiển thị danh sách followers */}
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={handleCloseModal}
        userId={user.userId}
      />
      {/* Modal hiển thị danh sách đang theo dõi (MỚI) */}
      <FollowingModal
        isOpen={showFollowingModal}
        onClose={handleCloseModal}
        userId={user.userId}
      />
    </div>
  );
}

export default UserProfile;