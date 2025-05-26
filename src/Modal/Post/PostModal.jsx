import React from "react";
import UserHeader from "./UserHeader";
import "./PostModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faRegularHeart,
  faComment,
  faBookmark,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faSolidHeart,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CommentList from "../../components/Comment/CommentList";
import { getCommentsByPostId } from "../../services/commentService";
import { getPostDetailById } from "../../services/userService"; 
import {
  reactToPost,
  unReactToPost,
  checkUserReaction,
} from "../../services/reactionService";
import { addComment } from "../../services/commentService";
import { formatTime } from "../../utils/time";

const PostModal = ({ onClose, post, onEditPost }) => { // Thêm onEditPost vào props
  const [detail, setDetail] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(
    post?.likeCount || post?.likes || 0
  );
  const [showHeart, setShowHeart] = React.useState(false);
  const [commentInput, setCommentInput] = React.useState("");
  const [replyTags, setReplyTags] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState(null);
  const [sendingComment, setSendingComment] = React.useState(false);
  const [loadingUser, setLoadingUser] = React.useState(false);
  const [commentsData, setCommentsData] = React.useState([]);
  const [replyToCommentId, setReplyToCommentId] = React.useState(null);
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [initialLikeCheckLoading, setInitialLikeCheckLoading] =
    React.useState(true);
  const [showOptionsDropdown, setShowOptionsDropdown] = React.useState(false); // <-- State cho dropdown

  const currentUserId = localStorage.getItem("userId");
  // Lấy userId của người đăng bài. Đảm bảo detail.userId hoặc post.userId có dữ liệu
  const postOwnerId = detail?.userId || post?.userId;

  const handleReply = (commentId, username) => {
    setReplyToCommentId(commentId);
    setReplyTags([username]);
    setCommentInput((prev) => {
      const tag = `@${username} `;
      if (prev.startsWith(tag)) return prev;
      return tag + prev.replace(/^@\w+\s*/, "");
    });
  };

  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    if (!currentUserId) {
      console.error("Bạn cần đăng nhập để bình luận!"); // Thay thế alert
      return;
    }
    setSendingComment(true);
    try {
      const contentToSend = commentInput.replace(/^@\w+\s*/, "");
      const userId = localStorage.getItem("userId");
      // Simulate API call without actual API
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      console.log("Đã gửi comment (chưa có API):", {
        userId,
        postId: post.postId || post.id,
        content: contentToSend,
        parentCommentId: replyToCommentId,
      });
      console.log("Bình luận đã được gửi (chỉ hiển thị tạm thời)!"); // Thay thế alert

      setCommentInput("");
      setReplyTags([]);
      setReplyToCommentId(null);
      // Re-fetch comments to update the list (or simulate update)
      const data = await getCommentsByPostId(post.postId || post.id); // Vẫn dùng API nếu nó hoạt động
      setCommentsData(data);
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err); // Thay thế alert
    } finally {
      setSendingComment(false);
    }
  };

  // HÀM XỬ LÝ NÚT XÓA BÀI VIẾT
  const handleDeletePost = () => {
    setShowOptionsDropdown(false); // Đóng dropdown
    console.log("Bạn đã click Xóa bài viết. (Chưa có API)");
    console.warn("Chức năng xóa bài viết chưa được tích hợp API."); // Thay thế alert
    // Nếu bạn muốn đóng modal ngay lập tức sau khi bấm (như thể đã xóa)
    // onClose();
  };


  const handleEditPost = () => {
    setShowOptionsDropdown(false); 
    if (typeof onEditPost === "function") {
      onEditPost(post.postId || post.id); 
    }
   
  };
  React.useEffect(() => {
    let ignore = false;
    if (!currentUserId || !(post?.postId || post?.id)) {
      setInitialLikeCheckLoading(false);
      return;
    }
    setInitialLikeCheckLoading(true);
    checkUserReaction(currentUserId, post.postId || post.id)
      .then((res) => {
        if (!ignore) setLiked(res);
      })
      .catch((err) => {
        console.error("Error checking user reaction:", err);
        if (!ignore) setLiked(false);
      })
      .finally(() => {
        if (!ignore) setInitialLikeCheckLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [post, currentUserId]);

  React.useEffect(() => {
    if (!detail?.userId) return;
    let ignore = false;
    async function fetchUser() {
      setLoadingUser(true);
      try {
        const { getUserById } = await import("../../services/userService");
        const user = await getUserById(detail.userId);
        if (!ignore) setUserInfo(user);
      } catch (e) {
        console.error("Error fetching user info:", e);
        if (!ignore) setUserInfo(null);
      } finally {
        if (!ignore) setLoadingUser(false);
      }
    }
    fetchUser();
    return () => {
      ignore = true;
    };
  }, [detail?.userId]);

  React.useEffect(() => {
    setCurrentIdx(0);
    setCommentInput("");
    setReplyTags([]);
    setReplyToCommentId(null);
  }, [post]);

  // Fetch comments by postId
  React.useEffect(() => {
    if (!post?.postId && !post?.id) return;
    let ignore = false;
    async function fetchComments() {
      setLoadingComments(true);
      try {
        const data = await getCommentsByPostId(post.postId || post.id);
        if (!ignore) setCommentsData(data);
      } catch (e) {
        console.error("Error fetching comments:", e);
        if (!ignore) setCommentsData([]);
      } finally {
        if (!ignore) setLoadingComments(false);
      }
    }
    fetchComments();
    return () => {
      ignore = true;
    };
  }, [post?.postId, post?.id]);

  React.useEffect(() => {
    let ignore = false;
    async function fetchDetail() {
      if (!post) return;
      if (post.content && post.fileUrls && post.createdAt && post.userId) {
        if (!ignore) setDetail(post);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getPostDetailById(post.postId || post.id);
        if (!ignore) setDetail(data);
      } catch (e) {
        console.error("Error fetching post detail:", e);
        if (!ignore) setDetail(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [post]);

  // Handle outside click to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra xem click có nằm ngoài dropdown container không
      if (
        showOptionsDropdown &&
        !event.target.closest(".post-options-dropdown-container")
      ) {
        setShowOptionsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptionsDropdown]);

  if (!post) return null;
  if (loading || !detail)
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content post-modal-fixed-width"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Skeleton cho caption/avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 24,
            }}
          >
            <div
              className="skeleton-image"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            ></div>
            <div>
              <div
                className="skeleton-image"
                style={{ width: 120, height: 16, marginBottom: 8 }}
              ></div>
              <div
                className="skeleton-image"
                style={{ width: 180, height: 14 }}
              ></div>
            </div>
          </div>
          <div
            className="skeleton-image"
            style={{ width: 300, height: 18, margin: "16px 24px" }}
          ></div>
          <div style={{ padding: 40, textAlign: "center" }}>
            Đang tải chi tiết bài viết...
          </div>
        </div>
      </div>
    );

  const images = Array.isArray(detail.fileUrls)
    ? detail.fileUrls.map((url) => ({ url, type: "image" }))
    : [];

  return (
    <div>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content post-modal-fixed-width"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="post-image">
            {images.length > 0 ? (
              <div
                className="carousel"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {images.length > 1 && (
                  <button
                    className="carousel-btn prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIdx((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
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
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                  onDoubleClick={async (e) => {
                    e.stopPropagation();
                    if (!currentUserId) {
                      console.error("Bạn cần đăng nhập để thả tim!"); // Thay thế alert
                      return;
                    }
                    if (!liked) {
                      setLiked(true);
                      setLikeCount((count) => count + 1);
                      setShowHeart(true);
                      try {
                        // Simulate API call for liking
                        await new Promise((resolve) =>
                          setTimeout(resolve, 300)
                        );
                        console.log("Đã thả tim (chưa có API)");
                      } catch (err) {
                        console.error("Error liking post (simulated):", err);
                        setLiked(false);
                        setLikeCount((count) => count - 1);
                      }
                    } else {
                      setShowHeart(true); // Vẫn hiển thị tim nếu double click lần nữa (đã like)
                    }
                    setTimeout(() => setShowHeart(false), 700);
                  }}
                >
                  <img
                    src={images[currentIdx].url}
                    alt={`Ảnh ${currentIdx + 1}`}
                    className="carousel-img"
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  {showHeart && (
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
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faSolidHeart}
                        style={{ color: "#e1306c" }}
                      />
                    </span>
                  )}
                </div>
                {images.length > 1 && (
                  <button
                    className="carousel-btn next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIdx((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      );
                    }}
                    aria-label="next"
                  >
                    <FiChevronRight size={18} />
                  </button>
                )}
                <div className="carousel-dots">
                  {Array.isArray(images) &&
                    images.length > 0 &&
                    images.map((img, idx) => (
                      <span
                        key={idx}
                        className={idx === currentIdx ? "dot active" : "dot"}
                        onClick={() => setCurrentIdx(idx)}
                      />
                    ))}
                </div>
              </div>
            ) : (
              <img
                src={
                  post.imageUrl ||
                  "https://via.placeholder.com/600x600?text=No+Image"
                } // Fallback image
                alt={`Bài viết ${post.id}`}
                loading="lazy"
              />
            )}
          </div>
          <div className="post-details">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                position: "relative",
              }}
            >
              {/* Nút 3 chấm cho Tùy chọn */}
              {currentUserId === postOwnerId && ( // Chỉ hiển thị nếu là chủ bài viết
                <div className="post-options-dropdown-container">
                  <button
                    className="ellipsis-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOptionsDropdown((prev) => !prev);
                    }}
                    aria-label="Tùy chọn bài viết"
                  >
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                  {showOptionsDropdown && (
                    <div className="options-dropdown-menu">
                      <button onClick={handleDeletePost}>Xóa bài viết</button>
                      <button onClick={handleEditPost}>
                        Chỉnh sửa bài viết
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button className="close-button" onClick={onClose}>
                ×
              </button>
            </div>
            <UserHeader loading={loadingUser} user={userInfo} />
            <PostCaption
              caption={detail.caption || detail.content}
              createdAt={detail.createdAt}
            />
            <CommentList
              comments={mapCommentsData(commentsData)}
              loading={loadingComments}
              onReply={handleReply}
            />
            <div className="small-interaction-container">
              <div className="icons">
                <div className="left-icons">
                  {/* Like/Unlike icon with effect and color */}
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
                      style={{ cursor: "pointer", display: "inline-block" }}
                      onClick={async () => {
                        if (!currentUserId) {
                          console.error("Bạn cần đăng nhập để thả tim!"); // Thay thế alert
                          return;
                        }
                        const prevLiked = liked;
                        const prevLikeCount = likeCount;
                        setLiked((liked) => !liked);
                        setLikeCount((count) =>
                          prevLiked ? count - 1 : count + 1
                        );
                        try {
                          // Simulate API call for liking
                          await new Promise((resolve) =>
                            setTimeout(resolve, 300)
                          );
                          console.log(
                            prevLiked
                              ? "Đã bỏ tim (chưa có API)"
                              : "Đã thả tim (chưa có API)"
                          );
                        } catch (err) {
                          console.error(
                            "Error updating like status (simulated):",
                            err
                          );
                          setLiked(prevLiked);
                          setLikeCount(prevLikeCount);
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={liked ? faSolidHeart : faRegularHeart}
                        style={{
                          color: liked ? "#e1306c" : "inherit",
                          fontSize: 22,
                          transition: "color 0.18s",
                        }}
                      />
                    </div>
                  )}
                  <FontAwesomeIcon icon={faComment} />
                  <FontAwesomeIcon icon={faPaperPlane} />
                </div>
                <div className="right-icons">
                  <FontAwesomeIcon icon={faBookmark} />
                </div>
              </div>
              <div className="likes-time">
                <p className="like-count-postmodal">{likeCount} lượt thích</p>
                <p>
                  {typeof detail.commentCount !== "undefined"
                    ? detail.commentCount
                    : post.comments || 0}{" "}
                  bình luận
                </p>
              </div>
              <div className="comment-input">
                <div className="emoji-icon">
                  <span>😊</span>
                </div>
                <input
                  type="text"
                  placeholder="Bình luận..."
                  value={commentInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCommentInput(value);
                    if (!/^@\w+\s/.test(value)) {
                      setReplyToCommentId(null);
                      setReplyTags([]);
                    }
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      await handleSendComment();
                    }
                  }}
                  disabled={sendingComment}
                />
                <button
                  onClick={handleSendComment}
                  disabled={!commentInput.trim() || sendingComment}
                >
                  {sendingComment ? "Đang gửi..." : "Đăng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function PostCaption({ caption, createdAt }) {
  return (
    <div style={{ marginTop: 8 }}>
      <span style={{ color: "#fff", fontSize: 15, wordBreak: "break-word" }}>
        {caption || "Không có caption"}
      </span>
      <span
        className="time-post"
        style={{ fontSize: 13, color: "#888", marginTop: 4 }}
      >
        {" "}
        {formatTime(createdAt)}
      </span>
    </div>
  );
}

function mapCommentsData(comments) {
  if (!comments) return [];
  return comments.map((c) => ({
    id: c.commentId,
    avatar: c.avatarUrl,
    username: c.username,
    text: c.content,
    time: formatTime(c.createdAt),
    replies: mapCommentsData(c.replies),
    deleted: c.deleted,
  }));
}

export default PostModal;
