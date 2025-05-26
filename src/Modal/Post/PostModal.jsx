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
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons"; // Tim đặc (đã thả tim)
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CommentList from "../../components/Comment/CommentList"; // Import CommentList component
import { getCommentsByPostId } from "../../services/commentService";
import { getPostDetailById } from "../../services/userService";
import {
  reactToPost,
  unReactToPost,
  checkUserReaction,
} from "../../services/reactionService";
import { addComment } from "../../services/commentService";

const PostModal = ({ onClose, post }) => {
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

  const currentUserId = localStorage.getItem("userId");

  const handleReply = (commentId, username) => {
    setReplyToCommentId(commentId);
    setReplyTags([username]);
    setCommentInput((prev) => {
      const tag = `@${username} `;

      if (prev.startsWith(tag)) return prev;

      return tag + prev.replace(/^@\w+\s*/, "");
    });
  };

  // Hàm gửi comment mới hoặc trả lời comment
  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    if (!currentUserId) {
      alert("Bạn cần đăng nhập để bình luận!");
      return;
    }
    console.log("day la id duoc lay ra ", replyToCommentId);
    console.log("day input ", commentInput);

    setSendingComment(true);
    try {
      const contentToSend = commentInput.replace(/^@\w+\s*/, "");
      const userId = localStorage.getItem("userId");
      await addComment({
        userId,
        postId: post.postId,
        content: contentToSend,
        parentCommentId: replyToCommentId,
      });
      setCommentInput("");
      setReplyTags([]);
      setReplyToCommentId(null);

      const data = await getCommentsByPostId(post.postId || post.id);
      setCommentsData(data);
    } catch (err) {
      alert("Có lỗi khi gửi bình luận: " + (err || "Không xác định"));
    } finally {
      setSendingComment(false);
    }
  };

  // Kiểm tra trạng thái đã like chưa khi mở modal
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
      .catch(() => {
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
      if (post.content && post.fileUrls && post.createdAt) {
        setDetail(post);
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
                    }}
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
                    if (!liked) {
                      setLiked(true);
                      setLikeCount((count) => count + 1);
                      setShowHeart(true);
                      try {
                        await reactToPost(
                          currentUserId,
                          post.postId || post.id
                        );
                      } catch (err) {
                        console.error("Error liking post:", err);
                        setLiked(false);
                        setLikeCount((count) => count - 1);
                      }
                    } else {
                      setShowHeart(true);
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
                    }}
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
                src={post.imageUrl}
                alt={`Bài viết ${post.id}`}
                loading="lazy"
              />
            )}
          </div>
          <div className="post-details">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                          alert("Bạn cần đăng nhập để thả tim!");
                          return;
                        }
                        const prevLiked = liked;
                        const prevLikeCount = likeCount;
                        setLiked((liked) => !liked);
                        setLikeCount((count) =>
                          prevLiked ? count - 1 : count + 1
                        );
                        try {
                          if (prevLiked) {
                            await unReactToPost(
                              currentUserId,
                              post.postId || post.id
                            );
                          } else {
                            await reactToPost(
                              currentUserId,
                              post.postId || post.id
                            );
                          }
                        } catch (err) {
                          console.error("Error updating like status:", err);
                          setLiked(prevLiked);
                          setLikeCount(prevLikeCount);
                          alert(
                            "Có lỗi xảy ra khi cập nhật trạng thái thả tim!"
                          );
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
                    // Nếu KHÔNG còn tag @username ở đầu input thì reset reply
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
                />
                <button
                  onClick={handleSendComment}
                  disabled={!commentInput.trim()}
                >
                  Đăng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hiển thị caption và thời gian
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

// Hàm format thời gian cho comment
import { formatTime } from "../../utils/time";

export default PostModal;
