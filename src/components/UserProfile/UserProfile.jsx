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
import HighlightList from "../Highlight/HighlightList";
import FollowersModal from "../../Modal/FollowersModal/FollowersModal"; // Import modal followers
// Import tất cả các hàm dịch vụ cần thiết
import {
  getUserByUsername,
  getPostCountByUserId,
  getFollowersCountByUserId, // Thêm import này
  getFollowingCountByUserId, // Thêm import này
} from "../../services/userService";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFollowersModal, setShowFollowersModal] = useState(false); // State để điều khiển modal
  // Loại bỏ state postCount riêng, vì nó sẽ được gộp vào đối tượng user.stats
  const username = localStorage.getItem("username"); // Lấy username của người dùng hiện tại từ localStorage

  useEffect(() => {
    // Nếu không có username trong localStorage, không thể tải thông tin profile
    if (!username) {
      setLoading(false);
      console.error(
        "Không tìm thấy username trong localStorage. Vui lòng đăng nhập."
      );
      // Bạn có thể redirect người dùng đến trang đăng nhập ở đây
      return;
    }

    setLoading(true); // Đặt trạng thái loading là true khi bắt đầu tải

    // Tạo một hàm bất đồng bộ để fetch tất cả dữ liệu
    const fetchProfileData = async () => {
      try {
        // Bước 1: Lấy thông tin người dùng cơ bản theo username
        const userData = await getUserByUsername(username);

        // Kiểm tra xem dữ liệu người dùng và userId có hợp lệ không
        if (!userData || !userData.userId) {
          throw new Error("Không tìm thấy thông tin người dùng hoặc userId.");
        }

        const userId = userData.userId;

        // Bước 2: Gọi đồng thời các API để lấy số lượng bài viết, người theo dõi, và đang theo dõi
        const [postsCount, followersCount, followingCount] = await Promise.all([
          getPostCountByUserId(userId),
          getFollowersCountByUserId(userId), // Gọi API lấy số người theo dõi
          getFollowingCountByUserId(userId), // Gọi API lấy số người đang theo dõi
        ]);

        // Bước 3: Gộp tất cả dữ liệu đã lấy vào state 'user'
        setUser({
          ...userData, // Giữ lại các thông tin user cơ bản (avatar, bio, v.v.)
          stats: {
            // Thêm trường stats để chứa các số liệu thống kê
            posts: postsCount || 0,
            followers: followersCount || 0,
            following: followingCount || 0,
          },
        });
      } catch (err) {
        console.error("Lỗi khi tải thông tin hồ sơ:", err);
        setUser(null); // Đặt user về null nếu có lỗi
      } finally {
        setLoading(false); // Dù thành công hay thất bại, cũng đặt loading về false
      }
    };

    fetchProfileData(); // Gọi hàm fetch dữ liệu
  }, [username]); // useEffect sẽ chạy lại khi username thay đổi (trong trường hợp này, username từ localStorage thường không đổi)

  // Hàm xử lý khi click vào số followers
  const handleFollowersClick = () => {
    setShowFollowersModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowFollowersModal(false);
  };

  // Hiển thị trạng thái tải hoặc lỗi
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

  // Lấy các số liệu từ user.stats để hiển thị, sử dụng toán tử ?? 0 để đảm bảo là số
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
                onClick={handleFollowersClick}
              >
                <span className="stat-number">{displayFollowers}</span>{" "}
                <span className="text-grey">người theo dõi</span>
              </div>
              <div className="stat-item">
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
      {/* Truyền userId của người dùng hiện tại xuống UserProfileContent */}
      <div className="list-post">
        <UserProfileContent userId={user.userId} />
      </div>

      {/* Modal hiển thị danh sách followers */}
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={handleCloseModal}
        userId={user.userId}
      />
    </div>
  );
}

export default UserProfile;
