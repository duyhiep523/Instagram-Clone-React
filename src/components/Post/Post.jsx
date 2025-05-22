import React from "react";
import "./Post.css"; // Đảm bảo file CSS này tồn tại và được cấu hình
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons"; // Tim đặc (đã thả tim)
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons"; // Tim rỗng (chưa thả tim)
import { faComment, faPaperPlane, faBookmark } from "@fortawesome/free-regular-svg-icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Import các service cần thiết
import { getFeedByUserId } from '../../services/feedService'; // Giữ nguyên nếu bạn có feedService
import { getUserById } from '../../services/userService';     // Giữ nguyên nếu bạn có userService
import { reactToPost, unReactToPost, checkUserReaction } from '../../services/reactionService'; // Import service thả tim/bỏ tim VÀ checkUserReaction

import { formatTime } from '../../utils/time'; // Giữ nguyên nếu bạn có formatTime

export function Post({ post, onClick }) {
  // State để quản lý hiển thị modal bình luận
  const [showModal, setShowModal] = React.useState(false);
  // Lazy load component PostModal để tối ưu hiệu suất
  const PostModal = React.lazy(() => import('../../Modal/Post/PostModal'));

  // State để quản lý index của ảnh hiện tại trong carousel
  const [currentIdx, setCurrentIdx] = React.useState(0);

  // State để kiểm tra xem người dùng hiện tại đã thả tim bài viết này chưa
  // Ban đầu đặt là false, sẽ được cập nhật sau khi gọi API checkUserReaction
  const [isLikedByUser, setIsLikedByUser] = React.useState(false);
  // State để hiển thị số lượt thích hiện tại (có thể cập nhật optimistically)
  const [currentLikeCount, setCurrentLikeCount] = React.useState(post.likeCount || 0);
  // State để hiển thị hiệu ứng tim lớn khi double click
  const [showHeartAnimation, setShowHeartAnimation] = React.useState(false);

  // State để lưu thông tin tác giả bài viết
  const [author, setAuthor] = React.useState(null);
  // State để theo dõi trạng thái tải thông tin tác giả
  const [authorLoading, setAuthorLoading] = React.useState(true);
  // State để theo dõi trạng thái tải kiểm tra like ban đầu
  const [initialLikeCheckLoading, setInitialLikeCheckLoading] = React.useState(true);


  // Lấy userId của người dùng hiện tại từ localStorage
  const currentUserId = localStorage.getItem('userId');

  // Effect để tải thông tin tác giả khi component mount hoặc post.userId thay đổi
  React.useEffect(() => {
    let ignore = false; // Biến cờ để tránh cập nhật state khi component đã unmount
    setAuthorLoading(true); // Bắt đầu tải, đặt trạng thái loading
    getUserById(post.userId) // Gọi service để lấy thông tin tác giả
      .then(data => {
        if (!ignore) { // Chỉ cập nhật state nếu component vẫn còn mount
          setAuthor(data);
          setAuthorLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setAuthorLoading(false); // Xử lý lỗi tải thông tin tác giả
      });
    return () => { ignore = true; }; // Cleanup function, đặt cờ ignore khi component unmount
  }, [post.userId]); // Dependency array: chạy lại effect khi post.userId thay đổi

  // NEW EFFECT: Kiểm tra trạng thái thả tim của người dùng hiện tại khi component mount
  React.useEffect(() => {
    let ignore = false;
    // Chỉ kiểm tra nếu có userId và postId hợp lệ
    if (!currentUserId || !post.postId) {
      setInitialLikeCheckLoading(false); // Không có userId hoặc postId thì không kiểm tra, kết thúc loading
      return;
    }

    setInitialLikeCheckLoading(true); // Bắt đầu tải trạng thái like ban đầu
    checkUserReaction(currentUserId, post.postId) // Gọi API để kiểm tra
      .then(hasReacted => {
        if (!ignore) { // Chỉ cập nhật state nếu component vẫn còn mount
          setIsLikedByUser(hasReacted); // Cập nhật trạng thái like
          setInitialLikeCheckLoading(false); // Kết thúc tải
        }
      })
      .catch(error => {
        console.error("Lỗi khi kiểm tra trạng thái like ban đầu:", error);
        if (!ignore) { // Chỉ cập nhật state nếu component vẫn còn mount
          setIsLikedByUser(false); // Mặc định là chưa like nếu có lỗi
          setInitialLikeCheckLoading(false); // Kết thúc tải
        }
      });

    return () => { ignore = true; }; // Cleanup function
  }, [currentUserId, post.postId]); // Chạy lại effect khi currentUserId hoặc post.postId thay đổi

  // Hàm xử lý khi double click vào ảnh/video của bài viết
  const handleDoubleClickOnMedia = async (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên các phần tử cha
    if (!currentUserId) {
      console.error("Người dùng chưa đăng nhập để thả tim bài viết.");
      // Có thể hiển thị thông báo cho người dùng ở đây
      return;
    }

    // Nếu bài viết chưa được người dùng hiện tại thả tim
    if (!isLikedByUser) {
      setIsLikedByUser(true); // Cập nhật trạng thái đã thả tim (optimistic update)
      setCurrentLikeCount(prev => prev + 1); // Tăng số lượt thích (optimistic update)
      setShowHeartAnimation(true); // Hiển thị hiệu ứng tim lớn
      setTimeout(() => setShowHeartAnimation(false), 700); // Ẩn hiệu ứng sau 700ms

      try {
        // Gọi API để thả tim
        await reactToPost(currentUserId, post.postId);
      } catch (error) {
        console.error("Lỗi khi thả tim bằng double click:", error);
        // Nếu API lỗi, hoàn tác lại trạng thái optimistic
        setIsLikedByUser(false);
        setCurrentLikeCount(prev => prev - 1);
        // Có thể hiển thị thông báo lỗi cho người dùng
      }
    } else {
      // Nếu đã thả tim rồi, vẫn hiển thị hiệu ứng tim khi double click
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 700);
    }
  };

  // Hàm xử lý khi click vào icon tim
  const handleHeartIconClick = async () => {
    if (!currentUserId) {
      console.error("Người dùng chưa đăng nhập để tương tác với bài viết.");
      // Có thể hiển thị thông báo cho người dùng ở đây
      return;
    }

    const prevLikedState = isLikedByUser; // Lưu trạng thái trước khi cập nhật optimistic
    const prevLikeCount = currentLikeCount; // Lưu số lượt thích trước khi cập nhật optimistic

    setIsLikedByUser(prev => !prev); // Đảo ngược trạng thái thả tim (optimistic update)
    setCurrentLikeCount(prev => (prevLikedState ? prev - 1 : prev + 1)); // Cập nhật số lượt thích (optimistic update)

    try {
      if (prevLikedState) {
        // Nếu trước đó đã thả tim, gọi API bỏ tim
        await unReactToPost(currentUserId, post.postId);
      } else {
        // Nếu trước đó chưa thả tim, gọi API thả tim
        await reactToPost(currentUserId, post.postId);
      }
    } catch (error) {
      console.error("Lỗi khi tương tác với tim:", error);
      // Nếu API lỗi, hoàn tác lại trạng thái optimistic
      setIsLikedByUser(prevLikedState);
      setCurrentLikeCount(prevLikeCount);
      // Có thể hiển thị thông báo lỗi cho người dùng
    }
  };


  return (
    <div className="instagram-post">
      <div className="post__header">
        <div className="header__info">
          <div className="avatar">
            {authorLoading ? (
              // Hiển thị placeholder khi đang tải avatar
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee' }} />
            ) : (
              // Hiển thị avatar hoặc ảnh mặc định nếu không có
              <img
                src={author?.profilePictureUrl || "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg"}
                alt="Avatar"
                loading="lazy"
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
          </div>
          <p>
            <span className="username">
              {authorLoading ? <span style={{ background: '#eee', width: 80, height: 16, display: 'inline-block', borderRadius: 4 }} /> : (author?.username || post.userId)}
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
          <div className="carousel" style={{ position: 'relative', width: '100%', height: 480, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', background: '#18191a' }}>
            {post.fileUrls.length > 1 && (
              // Nút chuyển ảnh trước đó
              <button
                className="carousel-btn prev"
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: 24, height: 24, fontSize: 18, padding: 0, background: 'rgba(0,0,0,0.18)', borderRadius: '50%', border: 'none', color: '#fff', cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); setCurrentIdx((prev) => (prev === 0 ? post.fileUrls.length - 1 : prev - 1)); }}
                aria-label="prev"
              ><FiChevronLeft size={18} /></button>
            )}
            <div
              className="carousel-media"
              style={{ cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}
              onDoubleClick={handleDoubleClickOnMedia} // Gắn hàm xử lý double click
            >
              <img
                src={post.fileUrls[currentIdx]}
                alt={`Ảnh ${currentIdx + 1}`}
                className="carousel-img"
                loading="lazy"
                style={{ width: '100%', height: 480, objectFit: 'contain', borderRadius: 8, background: '#222' }}
              />
              {showHeartAnimation && (
                // Hiệu ứng tim lớn khi double click
                <span style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%,-50%)',
                  fontSize: 80,
                  color: '#fff',
                  textShadow: '0 2px 12px #e1306c, 0 0 20px #fff',
                  pointerEvents: 'none',
                  zIndex: 5,
                  animation: 'heartPop 0.7s ease-out forwards' // Thêm animation cho hiệu ứng
                }}>
                  <FontAwesomeIcon icon={faSolidHeart} style={{ color: '#e1306c' }} />
                </span>
              )}
            </div>
            {post.fileUrls.length > 1 && (
              // Nút chuyển ảnh tiếp theo
              <button
                className="carousel-btn next"
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: 24, height: 24, fontSize: 18, padding: 0, background: 'rgba(0,0,0,0.18)', borderRadius: '50%', border: 'none', color: '#fff', cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); setCurrentIdx((prev) => (prev === post.fileUrls.length - 1 ? 0 : prev + 1)); }}
                aria-label="next"
              ><FiChevronRight size={18} /></button>
            )}
            <div className="carousel-dots" style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: 5 }}>
              {post.fileUrls.map((img, idx) => (
                <span
                  key={idx}
                  className={idx === currentIdx ? 'dot active' : 'dot'}
                  onClick={() => setCurrentIdx(idx)}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: idx === currentIdx ? '#3897f0' : '#aaa', cursor: 'pointer' }}
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
            style={{ width: '100%', height: 480, objectFit: 'contain', borderRadius: 8, background: '#222' }}
          />
        )}
      </div>
      <div className="post__actions">
        <div className="actions__left">
          {/* Hiển thị loading hoặc icon dựa trên trạng thái tải ban đầu */}
          {initialLikeCheckLoading ? (
            <div style={{ width: 24, height: 24, background: '#eee', borderRadius: '50%' }} />
          ) : (
            <div className="action__item" onClick={handleHeartIconClick} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon
                icon={isLikedByUser ? faSolidHeart : faRegularHeart}
                style={{ color: isLikedByUser ? '#e1306c' : 'inherit' }}
              />
            </div>
          )}
          <div className="action__item" style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faComment} />
          </div>
          <div className="action__item" style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
        </div>
        <div className="actions__right">
          <div className="action__item" style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </div>
      </div>
      <div className="post__details">
        {/* Hiển thị số lượt thích từ state currentLikeCount */}
        <span className="likes">{currentLikeCount} lượt thích</span>
        <div className="caption">
          <span className="username">{authorLoading ? <span style={{ background: '#eee', width: 60, height: 16, display: 'inline-block', borderRadius: 4 }} /> : (author?.username || post.userId)}</span>
          <span className="text">
            <p>{post.content}</p>
          </span>
        </div>
        {/* Phần Bình luận */}
        <div className="post__comments">
          <div className="view-all-comments" style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>
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
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Không tìm thấy userId! Vui lòng đăng nhập.');
      setLoading(false);
      return;
    }
    getFeedByUserId(userId)
      .then(data => {
        if (!ignore) {
          // Không cần tính toán isLikedByCurrentUser ở đây nữa,
          // vì Post component sẽ tự gọi API để kiểm tra.
          setPosts(data);
        }
      })
      .catch(err => {
        if (!ignore) {
          console.error("Lỗi tải feed:", err);
          setError('Lỗi tải feed! Vui lòng thử lại sau.');
        }
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải bài viết...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
  if (!posts.length) return <div style={{ textAlign: 'center', padding: '20px' }}>Không có bài viết nào để hiển thị!</div>;

  return (
    <div className="instagram-feed-container" style={{ maxWidth: 600, margin: '20px auto', padding: '0 15px' }}>
      {posts.map(post => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
}
