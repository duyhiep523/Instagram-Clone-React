import React from "react";
import "./Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faComment,
  faPaperPlane,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Import các service cần thiết
import { getFeedByUserId } from "../../services/feedService";
import { getUserById } from "../../services/userService";
import {
  reactToPost,
  unReactToPost,
  checkUserReaction,
} from "../../services/reactionService";

import { formatTime } from "../../utils/time";

export function Post({ post, onClick }) {
  // State để quản lý hiển thị modal bình luận
  const [showModal, setShowModal] = React.useState(false);
  // Lazy load component PostModal để tối ưu hiệu suất
  const PostModal = React.lazy(() => import("../../Modal/Post/PostModal"));

  const [currentIdx, setCurrentIdx] = React.useState(0);

  const [isLikedByUser, setIsLikedByUser] = React.useState(false);
  const [currentLikeCount, setCurrentLikeCount] = React.useState(
    post.likeCount || 0
  );
  const [showHeartAnimation, setShowHeartAnimation] = React.useState(false);

  const [author, setAuthor] = React.useState(null);
  const [authorLoading, setAuthorLoading] = React.useState(true);
  const [initialLikeCheckLoading, setInitialLikeCheckLoading] =
    React.useState(true);

  const currentUserId = localStorage.getItem("userId");

  React.useEffect(() => {
    let ignore = false;
    setAuthorLoading(true);
    getUserById(post.userId)
      .then((data) => {
        if (!ignore) {
          setAuthor(data);
          setAuthorLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setAuthorLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [post.userId]);

  React.useEffect(() => {
    let ignore = false;

    if (!currentUserId || !post.postId) {
      setInitialLikeCheckLoading(false);
      return;
    }

    setInitialLikeCheckLoading(true); // Bắt đầu tải trạng thái like ban đầu
    checkUserReaction(currentUserId, post.postId) // Gọi API để kiểm tra
      .then((hasReacted) => {
        if (!ignore) {
          // Chỉ cập nhật state nếu component vẫn còn mount
          setIsLikedByUser(hasReacted); // Cập nhật trạng thái like
          setInitialLikeCheckLoading(false); // Kết thúc tải
        }
      })
      .catch((error) => {
        console.error("Lỗi khi kiểm tra trạng thái like ban đầu:", error);
        if (!ignore) {
          // Chỉ cập nhật state nếu component vẫn còn mount
          setIsLikedByUser(false); // Mặc định là chưa like nếu có lỗi
          setInitialLikeCheckLoading(false); // Kết thúc tải
        }
      });

    return () => {
      ignore = true;
    };
  }, [currentUserId, post.postId]);

  const handleDoubleClickOnMedia = async (e) => {
    if (!currentUserId) {
      console.error("Người dùng chưa đăng nhập để thả tim bài viết.");
      return;
    }

    if (!isLikedByUser) {
      setIsLikedByUser(true);
      setCurrentLikeCount((prev) => prev + 1);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 700);

      try {
        // Gọi API để thả tim
        await reactToPost(currentUserId, post.postId);
      } catch (error) {
        console.error("Lỗi khi thả tim bằng double click:", error);

        setIsLikedByUser(false);
        setCurrentLikeCount((prev) => prev - 1);
      }
    } else {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 700);
    }
  };

  const handleHeartIconClick = async () => {
    if (!currentUserId) {
      console.error("Người dùng chưa đăng nhập để tương tác với bài viết.");
      return;
    }

    const prevLikedState = isLikedByUser;
    const prevLikeCount = currentLikeCount;

    setIsLikedByUser((prev) => !prev);
    setCurrentLikeCount((prev) => (prevLikedState ? prev - 1 : prev + 1));

    try {
      if (prevLikedState) {
        await unReactToPost(currentUserId, post.postId);
      } else {
        await reactToPost(currentUserId, post.postId);
      }
    } catch (error) {
      console.error("Lỗi khi tương tác với tim:", error);

      setIsLikedByUser(prevLikedState);
      setCurrentLikeCount(prevLikeCount);
    }
  };

  return (
    <div className="instagram-post">
      <div className="post__header">
        <div className="header__info">
          <div className="avatar">
            {authorLoading ? (
              // Hiển thị placeholder khi đang tải avatar
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#eee",
                }}
              />
            ) : (
              <img
                src={
                  author?.profilePictureUrl ||
                  "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg"
                }
                alt="Avatar"
                loading="lazy"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
          <p>
            <span className="username">
              {authorLoading ? (
                <span
                  style={{
                    background: "#eee",
                    color: "#222",
                    width: 80,
                    height: 16,
                    display: "inline-block",
                    borderRadius: 4,
                  }}
                />
              ) : (
                <a
                  href={`/user/${author?.username || post.userId}`}
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {author?.username || post.userId}
                </a>
              )}
            </span>
            <span className="time">{formatTime(post.createdAt)}</span>
          </p>
        </div>
        <div className="header__options">
          <span>...</span>
        </div>
      </div>
      <div className="post__content">
        {Array.isArray(post.fileUrls) && post.fileUrls.length > 0 ? (
          <div
            className="carousel"
            style={{
              position: "relative",
              width: "100%",
              height: 480,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              background: "#18191a",
            }}
          >
            {post.fileUrls.length > 1 && (
              // Nút chuyển ảnh trước đó
              <button
                className="carousel-btn prev"
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  width: 24,
                  height: 24,
                  fontSize: 18,
                  padding: 0,
                  background: "rgba(0,0,0,0.18)",
                  borderRadius: "50%",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx((prev) =>
                    prev === 0 ? post.fileUrls.length - 1 : prev - 1
                  );
                }}
                aria-label="prev"
              >
                <FiChevronLeft size={18} />
              </button>
            )}
            <div
              className="carousel-media"
              style={{
                cursor: "pointer",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
              onDoubleClick={handleDoubleClickOnMedia} // Gắn hàm xử lý double click
            >
              <img
                src={post.fileUrls[currentIdx]}
                alt={`Ảnh ${currentIdx + 1}`}
                className="carousel-img"
                loading="lazy"
                style={{
                  width: "100%",
                  height: 480,
                  objectFit: "contain",
                  borderRadius: 8,
                  background: "#222",
                }}
              />
              {showHeartAnimation && (
                // Hiệu ứng tim lớn khi double click
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%)",
                    fontSize: 80,
                    color: "#fff",
                    textShadow: "0 2px 12px #e1306c, 0 0 20px #fff",
                    pointerEvents: "none",
                    zIndex: 5,
                    animation: "heartPop 0.7s ease-out forwards", // Thêm animation cho hiệu ứng
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSolidHeart}
                    style={{ color: "#e1306c" }}
                  />
                </span>
              )}
            </div>
            {post.fileUrls.length > 1 && (
              // Nút chuyển ảnh tiếp theo
              <button
                className="carousel-btn next"
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  width: 24,
                  height: 24,
                  fontSize: 18,
                  padding: 0,
                  background: "rgba(0,0,0,0.18)",
                  borderRadius: "50%",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx((prev) =>
                    prev === post.fileUrls.length - 1 ? 0 : prev + 1
                  );
                }}
                aria-label="next"
              >
                <FiChevronRight size={18} />
              </button>
            )}
            <div
              className="carousel-dots"
              style={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 3,
                display: "flex",
                gap: 5,
              }}
            >
              {post.fileUrls.map((img, idx) => (
                <span
                  key={idx}
                  className={idx === currentIdx ? "dot active" : "dot"}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: idx === currentIdx ? "#3897f0" : "#aaa",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          // Hiển thị ảnh đơn nếu không phải carousel
          <img
            src={post.imageUrl}
            alt="Post Content"
            loading="lazy"
            style={{
              width: "100%",
              height: 480,
              objectFit: "contain",
              borderRadius: 8,
              background: "#222",
            }}
          />
        )}
      </div>
      <div className="post__actions">
        <div className="actions__left">
          {/* Hiển thị loading hoặc icon dựa trên trạng thái tải ban đầu */}
          {initialLikeCheckLoading ? (
            <div
              style={{
                width: 24,
                height: 24,
                background: "#eee",
                borderRadius: "50%",
              }}
            />
          ) : (
            <div
              className="action__item"
              onClick={handleHeartIconClick}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={isLikedByUser ? faSolidHeart : faRegularHeart}
                style={{ color: isLikedByUser ? "#e1306c" : "inherit" }}
              />
            </div>
          )}
          <div className="action__item" style={{ cursor: "pointer" }}>
            <FontAwesomeIcon icon={faComment} />
          </div>
          <div className="action__item" style={{ cursor: "pointer" }}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
        </div>
        <div className="actions__right">
          <div className="action__item" style={{ cursor: "pointer" }}>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </div>
      </div>
      <div className="post__details">
        {/* Hiển thị số lượt thích từ state currentLikeCount */}
        <span className="likes">{currentLikeCount} lượt thích</span>
        <div className="caption">
          <span className="username">
            {authorLoading ? (
              <span
                style={{
                  background: "#eee",
                  width: 60,
                  height: 16,
                  display: "inline-block",
                  borderRadius: 4,
                }}
              />
            ) : (
              author?.username || post.userId
            )}
          </span>
          <span className="text">
            <p>{post.content}</p>
          </span>
        </div>
        {/* Phần Bình luận */}
        <div className="post__comments">
          <div
            className="view-all-comments"
            style={{ cursor: "pointer" }}
            onClick={() => setShowModal(true)}
          >
            Xem tất cả {post.commentCount} bình luận
          </div>
          <div className="add-comment">
            <input type="text" placeholder="Bình luận..." />
            <button disabled={true}>Đăng</button>
            <span className="emoji-icon">😊</span>
          </div>
        </div>
      </div>
      {showModal && (
        <React.Suspense fallback={<div>Đang tải...</div>}>
          <PostModal onClose={() => setShowModal(false)} post={post} />
        </React.Suspense>
      )}
    </div>
  );
}

// Component hiển thị danh sách bài viết đề xuất (feed)
export default function InstagramFeed() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Không tìm thấy userId! Vui lòng đăng nhập.");
      setLoading(false);
      return;
    }
    getFeedByUserId(userId)
      .then((data) => {
        if (!ignore) {
          setPosts(data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Lỗi tải feed:", err);
          setError("Lỗi tải feed! Vui lòng thử lại sau.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Đang tải bài viết...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        {error}
      </div>
    );
  if (!posts.length)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Không có bài viết nào để hiển thị!
      </div>
    );

  return (
    <div
      className="instagram-feed-container"
      style={{ maxWidth: 600, margin: "20px auto", padding: "0 15px" }}
    >
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
}
