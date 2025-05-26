import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./FollowersModal.module.css";
import { toast } from "react-toastify"; // Import toast

// Import các hàm API từ followService
import { getFollowersByUserId } from "../../services/followService"; // Điều chỉnh đường dẫn cho đúng
import {
  followUser, // Để theo dõi
  unfollowUser, // Để bỏ theo dõi
} from "../../services/userService"; // Điều chỉnh đường dẫn cho đúng

const FollowersModal = ({ isOpen, onClose, userId }) => {
  const [followers, setFollowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem("userId"); // Lấy userId của người dùng hiện tại

  useEffect(() => {
    const fetchFollowers = async () => {
      if (isOpen && userId) {
        setLoading(true);
        setError(null);
        try {
          const data = await getFollowersByUserId(userId);
          setFollowers(data);
        } catch (err) {
          console.error("Lỗi khi tải danh sách người theo dõi:", err);
          setError("Không thể tải danh sách người theo dõi. Vui lòng thử lại.");
          toast.error("Không thể tải danh sách người theo dõi."); // Toast khi lỗi tải danh sách
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFollowers();
  }, [isOpen, userId]);

  const handleAction = async (targetUserId, relationshipStatus) => {
    if (!currentUserId) {
      toast.warn("Bạn cần đăng nhập để thực hiện hành động này."); // Dùng toast.warn
      return;
    }

    try {
      if (relationshipStatus === "followed_back") {
        // Nút "Theo dõi lại"
        // Ý nghĩa: Người này đang theo dõi mình, mình theo dõi lại họ => thành bạn bè
        // Hành động: followUser
        await followUser(currentUserId, targetUserId);
        // Cập nhật UI: Chuyển từ 'followed_back' sang 'friend'
        setFollowers((prev) =>
          prev.map((f) =>
            f.userId === targetUserId
              ? { ...f, relationshipStatus: "friend" }
              : f
          )
        );
        toast.success(
          `Bạn đã theo dõi ${
            followers.find((f) => f.userId === targetUserId)?.username ||
            "người này"
          } lại!`
        ); // Toast thành công
      } else if (relationshipStatus === "friend") {
      
        await unfollowUser(currentUserId, targetUserId);
        setFollowers((prev) =>
          prev.map((f) =>
            f.userId === targetUserId
              ? { ...f, relationshipStatus: "followed_back" }
              : f
          )
        );
        toast.success(
          `Bạn đã hủy theo dõi ${
            followers.find((f) => f.userId === targetUserId)?.username ||
            "người này"
          }!`
        ); // Toast thành công
      }
      // Các trạng thái khác (ví dụ: 'none', 'follower', 'following') sẽ không hiển thị nút hoặc hiển thị nút 'Theo dõi'
    } catch (err) {
      console.error("Lỗi khi thực hiện hành động:", err);
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại."); // Toast lỗi
    }
  };

  // Lọc followers theo search term
  const filteredFollowers = followers.filter(
    (follower) =>
      follower.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      follower.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Người theo dõi</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className={styles.searchIcon}
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Followers List */}
        <div className={styles.followersList}>
          {loading ? (
            <div className={styles.loading}>Đang tải...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : filteredFollowers.length === 0 ? (
            <div className={styles.noResults}>Không tìm thấy kết quả nào.</div>
          ) : (
            filteredFollowers.map((follower) => (
              <div key={follower.userId} className={styles.followerItem}>
                <div className={styles.followerInfo}>
                  <div className={styles.avatar}>
                    <img
                      src={follower.profilePictureUrl}
                      alt={follower.username}
                    />
                  </div>
                  <div className={styles.userDetails}>
                    <Link
                      to={`/user/${follower.username}`}
                      onClick={onClose}
                      className={styles.usernameLink}
                    >
                      <div className={styles.username}>{follower.username}</div>
                    </Link>
                    <div className={styles.fullName}>{follower.fullName}</div>
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  {/* Nút "Theo dõi lại" (khi bấm sẽ follow họ) */}
                  {follower.relationshipStatus === "followed_back" && (
                    <button
                      className={styles.followButton}
                      onClick={() =>
                        handleAction(follower.userId, "followed_back")
                      }
                    >
                      Theo dõi lại
                    </button>
                  )}
               
                  {follower.relationshipStatus === "friend" && (
                    <button
                      className={styles.followingButton}
                      onClick={() => handleAction(follower.userId, "friend")}
                    >
                      Đang theo dõi
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
