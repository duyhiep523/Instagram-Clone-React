import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./FollowingModal.module.css";
import { toast } from 'react-toastify';

import { getFollowingByUserId } from "../../services/followService";
import {
  followUser,
  unfollowUser,
} from "../../services/userService";

const FollowingModal = ({ isOpen, onClose, userId }) => {
  const [following, setFollowing] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchFollowing = async () => {
      if (isOpen && userId) {
        setLoading(true);
        setError(null);
        try {
          const data = await getFollowingByUserId(userId);
          // Thêm trường `isPendingAction` để quản lý trạng thái pending của từng user
          setFollowing(data.map(item => ({ ...item, isPendingAction: false })));
        } catch (err) {
          console.error("Lỗi khi tải danh sách đang theo dõi:", err);
          setError("Không thể tải danh sách đang theo dõi. Vui lòng thử lại.");
          toast.error("Không thể tải danh sách đang theo dõi.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFollowing();
  }, [isOpen, userId]);

  const handleAction = async (targetUserId, currentRelationshipStatus) => {
    if (!currentUserId) {
      toast.warn("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    }

    // Đánh dấu trạng thái pending cho người dùng đang thao tác
    setFollowing(prev =>
      prev.map(f =>
        f.userId === targetUserId ? { ...f, isPendingAction: true } : f
      )
    );

    try {
      if (currentRelationshipStatus === "friend" || currentRelationshipStatus === "following") {
        // Nếu là 'friend' hoặc 'following', bấm vào để UNFOLLOW
        await unfollowUser(currentUserId, targetUserId);
        setFollowing((prev) =>
          prev.map((f) =>
            f.userId === targetUserId ? { ...f, relationshipStatus: "not_following", isPendingAction: false } : f
          )
        );
        toast.success(`Bạn đã hủy theo dõi ${
          following.find(f => f.userId === targetUserId)?.username || "người này"
        }!`);
      } else if (currentRelationshipStatus === "not_following") {
        await followUser(currentUserId, targetUserId);
        
        setFollowing((prev) =>
          prev.map((f) =>
            f.userId === targetUserId ? { ...f, relationshipStatus: "following", isPendingAction: false } : f
          )
        );
        toast.success(`Bạn đã theo dõi ${
          following.find(f => f.userId === targetUserId)?.username || "người này"
        }!`);
      }
    } catch (err) {
      console.error("Lỗi khi thực hiện hành động:", err);
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
      // Đảm bảo loại bỏ trạng thái pending khi có lỗi
      setFollowing(prev =>
        prev.map(f =>
          f.userId === targetUserId ? { ...f, isPendingAction: false } : f
        )
      );
    }
  };

  const filteredFollowing = following.filter(
    (item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className={styles.modalTitle}>Đang theo dõi</h2>
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

        {/* Following List */}
        <div className={styles.followingList}>
          {loading ? (
            <div className={styles.loading}>Đang tải...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : filteredFollowing.length === 0 ? (
            <div className={styles.noResults}>Không tìm thấy kết quả nào.</div>
          ) : (
            filteredFollowing.map((item) => (
              <div key={item.userId} className={styles.followingItem}>
                <div className={styles.followingInfo}>
                  <div className={styles.avatar}>
                    <img
                      src={item.profilePictureUrl}
                      alt={item.username}
                    />
                  </div>
                  <div className={styles.userDetails}>
                    <Link
                      to={`/user/${item.username}`}
                      onClick={onClose}
                      className={styles.usernameLink}
                    >
                      <div className={styles.username}>
                        {item.username}
                      </div>
                    </Link>
                    <div className={styles.fullName}>{item.fullName}</div>
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  {item.relationshipStatus === "friend" && (
                    <button
                      className={styles.friendButton}
                      onClick={() => handleAction(item.userId, "friend")}
                      disabled={item.isPendingAction}
                    >
                      {item.isPendingAction ? "Đang xử lý..." : "Bạn bè"}
                    </button>
                  )}
                  {item.relationshipStatus === "following" && (
                    <button
                      className={styles.followingButton}
                      onClick={() => handleAction(item.userId, "following")}
                      disabled={item.isPendingAction}
                    >
                      {item.isPendingAction ? "Đang xử lý..." : "Đang theo dõi"}
                    </button>
                  )}
                  {/* Trạng thái sau khi unfollow (hoặc chưa từng follow) */}
                  {(item.relationshipStatus === "not_following" || item.relationshipStatus === undefined) && (
                    <button
                      className={styles.followButton}
                      onClick={() => handleAction(item.userId, "not_following")}
                      disabled={item.isPendingAction}
                    >
                      {item.isPendingAction ? "Đang xử lý..." : "Theo dõi"}
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

export default FollowingModal;