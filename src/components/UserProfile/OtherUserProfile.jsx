import React from "react";
import "./UserProfile.css"; // Có thể dùng lại style
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import HighlightList from "../Highlight/HighlightList";
import UserProfileContent from "./UserProfileContent";

function OtherUserProfile({ user }) {
  // user: {avatar, username, name, bio, stats: {posts, followers, following}}
  // Nếu không truyền user, dùng mẫu demo
  const demoUser = {
    avatar: "https://i.pravatar.cc/150?img=5",
    username: "miu_dynh",
    name: "Vũ Minh Duy",
    bio: "Đây là tiểu sử demo của người khác",
    stats: { posts: 10, followers: 16, following: 24 },
  };
  const displayUser = { ...demoUser, ...user };
  return (
    <div className="user-profile-header">
      <div>
        <div className="profile-info-top">
          <div className="avatar-container">
            <div className="avatar" style={{width: "160px", height: "160px"}}>
              <img
                src={displayUser.avatar}
                alt="Avatar"
              />
            </div>
          </div>
          <div className="user-details">
            <div className="username-row">
              <div className="username-row-item">
                <p className="username">{displayUser.username}</p>
              </div>
              <div className="username-row-item">
                <button className="follow-btn">Theo dõi</button>
              </div>
              <div className="username-row-item">
                <button className="message-btn">Nhắn tin</button>
              </div>
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
        <HighlightList isOwnProfile={false} />
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
        <UserProfileContent />
      </div>
    </div>
  );
}

export default OtherUserProfile;
