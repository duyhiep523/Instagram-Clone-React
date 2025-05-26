import React, { useEffect, useState, useCallback } from "react";
import "./UserProfile.css";
import { Link } from "react-router-dom";
import UserProfileContent from "./UserProfileContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { Plus } from "react-feather";
import HighlightList from "../Highlight/HighlightList";
import { toast } from 'react-toastify'; // <-- Thay đổi import này

import {
  getUserByUsername,
  getPostCountByUserId,
  getFollowersCountByUserId,
  getFollowingCountByUserId, 
  getRelationshipStatus,
  followUser,
  unfollowUser,
} from "../../services/userService";

/**
 * Props:
 * - username: string (bắt buộc để fetch dữ liệu)
 */
function OtherUserProfile({ username }) {
  console.log("Đang tải hồ sơ cho:", username);

  const demoUser = {
    userId: "demo_user_id_123",
    avatar: "https://i.pravatar.cc/150?img=5",
    username: "miu_dynh",
    name: "Vũ Minh Duy",
    bio: "Đây là tiểu sử demo của người khác",
    stats: { posts: 10, followers: 16, following: 24 },
    relationshipStatus: "none",
  };

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem("userId");

  const fetchProfileData = useCallback(async () => {
    if (!username) {
      setProfile(demoUser);
      setLoading(false);
      setError("Không tìm thấy username, hiển thị dữ liệu demo.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await getUserByUsername(username);

      if (!userData || !userData.userId) {
        throw new Error("Không tìm thấy userId của người dùng.");
      }
      const targetUserId = userData.userId;

      const [postsCount, followersCount, followingCount, relationshipStatus] =
        await Promise.all([
          getPostCountByUserId(targetUserId),
          getFollowersCountByUserId(targetUserId),
          getFollowingCountByUserId(targetUserId),
          currentUserId && currentUserId !== targetUserId
            ? getRelationshipStatus(currentUserId, targetUserId)
            : Promise.resolve("self"),
        ]);

      setProfile({
        userId: targetUserId,
        avatar: userData.profilePictureUrl,
        username: userData.username,
        name: userData.fullName,
        bio: userData.bio,
        stats: {
          posts: postsCount || 0,
          followers: followersCount || 0,
          following: followingCount || 0,
        },
        relationshipStatus: relationshipStatus,
      });
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi tải trang cá nhân:", err);
      setError(err.message || "Không tìm thấy người dùng hoặc lỗi mạng.");
      setProfile(null);
      setLoading(false);
    }
  }, [username, currentUserId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleFollowToggle = async () => {
    if (!currentUserId || !profile || !profile.userId) {
      toast.error("Không thể thực hiện hành động. Vui lòng đăng nhập hoặc thử lại.");
      return;
    }

    const targetUserId = profile.userId;
    const oldRelationshipStatus = profile.relationshipStatus;
    const oldFollowersCount = profile.stats.followers;
    const oldFollowingCount = profile.stats.following;

    try {
      if (oldRelationshipStatus === "none") {
        setProfile((prevProfile) => ({
          ...prevProfile,
          relationshipStatus: "following",
          stats: {
            ...prevProfile.stats,
            followers: prevProfile.stats.followers + 1,
          },
        }));
        await followUser(currentUserId, targetUserId);
        toast.success("Đã theo dõi thành công!");
      } else if (oldRelationshipStatus === "friend") {
        setProfile((prevProfile) => ({
          ...prevProfile,
          relationshipStatus: "followed_back",
          stats: {
            ...prevProfile.stats,
            // followers không đổi vì họ vẫn theo dõi mình
          },
        }));
        await unfollowUser(currentUserId, targetUserId);
        toast.success("Đã hủy kết bạn thành công! Họ vẫn đang theo dõi bạn.");
      } else if (oldRelationshipStatus === "followed_back") {
        setProfile((prevProfile) => ({
          ...prevProfile,
          relationshipStatus: "friend",
          stats: {
            ...prevProfile.stats,
            followers: prevProfile.stats.followers + 1,
          },
        }));
        await followUser(currentUserId, targetUserId);
        toast.success("Đã theo dõi lại thành công! Bây giờ là bạn bè.");
      } else if (oldRelationshipStatus === "following") {
        setProfile((prevProfile) => ({
          ...prevProfile,
          relationshipStatus: "none",
          stats: {
            ...prevProfile.stats,
            followers: Math.max(0, prevProfile.stats.followers - 1),
          },
        }));
        await unfollowUser(currentUserId, targetUserId);
        toast.success("Đã hủy theo dõi thành công!");
      }
      await fetchProfileData();
    } catch (err) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        relationshipStatus: oldRelationshipStatus,
        stats: {
          ...prevProfile.stats,
          followers: oldFollowersCount,
          following: oldFollowingCount,
        },
      }));
      console.error("Lỗi khi thực hiện hành động theo dõi/hủy theo dõi:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi thực hiện hành động.");
    }
  };

  if (loading)
    return (
      <div className="user-profile-header">
        <div style={{ padding: 32 }}>Đang tải trang cá nhân...</div>
      </div>
    );
  if (error)
    return (
      <div className="user-profile-header">
        <div style={{ padding: 32, color: "red" }}>{error}</div>
      </div>
    );

  const displayUser = profile || demoUser;

  const renderActionButtons = () => {
    switch (displayUser.relationshipStatus) {
      case "self":
        return (
          <>
            <div className="username-row-item">
              <button className="edit-profile">
                <Link to="/profile-edit" style={{ textDecoration: "none", color: "white" }}>
                  <p>Chỉnh sửa trang cá nhân</p>
                </Link>
              </button>
            </div>
            <div className="username-row-item">
              <button className="view-saved">Xem kho lưu trữ</button>
            </div>
          </>
        );
      case "friend":
        return (
          <>
            <div className="username-row-item">
              <button className="follow-btn" onClick={handleFollowToggle}>
                Hủy kết bạn
              </button>
            </div>
            <div className="username-row-item">
              <button className="message-btn">Nhắn tin</button>
            </div>
          </>
        );
      case "followed_back":
        return (
          <>
            <div className="username-row-item">
              <button className="follow-btn" onClick={handleFollowToggle}>
                Theo dõi lại
              </button>
            </div>
            <div className="username-row-item">
              <button className="message-btn">Nhắn tin</button>
            </div>
          </>
        );
      case "following":
        return (
          <>
            <div className="username-row-item">
              <button className="follow-btn" onClick={handleFollowToggle}>
                Đang theo dõi
              </button>
            </div>
            <div className="username-row-item">
              <button className="message-btn">Nhắn tin</button>
            </div>
          </>
        );
      case "none":
      default:
        return (
          <>
            <div className="username-row-item">
              <button className="follow-btn" onClick={handleFollowToggle}>
                Theo dõi
              </button>
            </div>
            <div className="username-row-item">
              <button className="message-btn">Nhắn tin</button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="user-profile-header">
      <div>
        <div className="profile-info-top">
          <div className="avatar-container">
            <div className="avatar" style={{ width: "160px", height: "160px" }}>
              <img src={displayUser.avatar} alt="Avatar" />
            </div>
          </div>
          <div className="user-details">
            <div className="username-row">
              <div className="username-row-item">
                <p className="username">{displayUser.username}</p>
              </div>
              {renderActionButtons()}
              <div className="username-row-item">
                <FontAwesomeIcon icon={faGear} />
              </div>
            </div>

            <div className="user-bio">
              <span className="name">{displayUser.name}</span>
            </div>

            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-number">{displayUser.stats.posts}</span>{" "}
                <span className="text-grey">bài viết</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{displayUser.stats.followers}</span>{" "}
                <span className="text-grey">người theo dõi</span>
              </div>
              <div className="stat-item">
                <span className="text-grey">Đang theo dõi</span>{" "}
                <span className="stat-number">{displayUser.stats.following}</span>{" "}
                <span className="text-grey">người dùng</span>
              </div>
            </div>

            <div className="bio-main">
              Giới thiệu
              <p>{displayUser.bio}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="highlight-container">
        <HighlightList isOwnProfile={false}  userId={displayUser.userId}/>
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
        <UserProfileContent userId={displayUser.userId} />
      </div>
    </div>
  );
}

export default OtherUserProfile;