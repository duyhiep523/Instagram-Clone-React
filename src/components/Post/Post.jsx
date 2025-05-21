import React from "react";
import "./Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";

import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function InstagramPost() {
  const [showModal, setShowModal] = React.useState(false);
  const PostModal = React.lazy(() => import('../../Modal/Post/PostModal'));
  // const [currentIdx, setCurrentIdx] = React.useState(0);
  const [liked, setLiked] = React.useState(false);
  const [showHeart, setShowHeart] = React.useState(false);
  // Dữ liệu post mẫu, có thể lấy từ props hoặc API thực tế
  // Dữ liệu demo post nhiều ảnh/video
  const post = {
    id: 1,
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        type: "image"
      },
      {
        url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
        type: "image"
      }
    ],
    likes: 583,
    comments: 23,
    caption: "Đây là caption demo cho bài viết nhiều ảnh/video",
    username: "doc.sach.moi.ngay"
  };
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  return (
    <div className="instagram-post">
      <div className="post__header">
        <div className="header__info">
          <div className="avatar">
            <img
              src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg"
              alt="Avatar"
            />
          </div>
          <p>
            <span className="username">doc.sach.moi.ngay</span>
            <span className="time">7 giờ</span>
          </p>
        </div>
        <div className="header__options">
          <span>...</span>
        </div>
      </div>

      {/* Phần Nội dung (Ảnh/Video) */}
      <div className="post__content">
        {Array.isArray(post.images) && post.images.length > 0 ? (
          <div className="carousel" style={{position:'relative', width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
            {post.images.length > 1 && (
              <button
                className="carousel-btn prev"
                style={{position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', zIndex:2, width:24, height:24, fontSize:18, padding:0, background:'rgba(0,0,0,0.18)'}}
                onClick={e => { e.stopPropagation(); setCurrentIdx((prev) => (prev === 0 ? post.images.length - 1 : prev - 1)); }}
                aria-label="prev"
              ><FiChevronLeft size={18} /></button>
            )}
            <div
              className="carousel-media"
              style={{cursor:'pointer', width:'100%', display:'flex', justifyContent:'center', position:'relative'}} 
              // Không mở modal khi click hoặc double click vào ảnh nữa
              onClick={null}
              onDoubleClick={e => {
                e.stopPropagation();
                if (!liked) setLiked(true);
                setShowHeart(true);
                setTimeout(() => setShowHeart(false), 700);
              }}
            >
              <img
                src={post.images[currentIdx].url}
                alt={`Ảnh ${currentIdx + 1}`}
                className="carousel-img"
                style={{width:'100%', height:'auto', objectFit:'cover', borderRadius:8}}
              />
              {showHeart && (
                <span style={{
                  position:'absolute',
                  left:'50%',
                  top:'50%',
                  transform:'translate(-50%,-50%)',
                  fontSize:80,
                  color:'#fff',
                  textShadow:'0 2px 12px #e1306c, 0 0 20px #fff',
                  pointerEvents:'none',
                  zIndex:5
                }}>
                  <FontAwesomeIcon icon={faHeart} style={{color:'#e1306c'}}/>
                </span>
              )}
            </div>
            {post.images.length > 1 && (
              <button
                className="carousel-btn next"
                style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', zIndex:2, width:24, height:24, fontSize:18, padding:0, background:'rgba(0,0,0,0.18)'}}
                onClick={e => { e.stopPropagation(); setCurrentIdx((prev) => (prev === post.images.length - 1 ? 0 : prev + 1)); }}
                aria-label="next"
              ><FiChevronRight size={18} /></button>
            )}
            <div className="carousel-dots">
              {post.images.map((img, idx) => (
                <span
                  key={idx}
                  className={idx === currentIdx ? 'dot active' : 'dot'}
                  onClick={() => setCurrentIdx(idx)}
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            src={post.imageUrl}
            alt="Post Content"
          />
        )}
      </div>

      <div className="post__actions">
        <div className="actions__left">
          <div className="action__item">
            <FontAwesomeIcon icon={faHeart} />
          </div>
          <div className="action__item">
            <FontAwesomeIcon icon={faComment} />
          </div>{" "}
          <div className="action__item">
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
        </div>
        <div className="actions__right">
          <div className="action__item">
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </div>
      </div>

      <div className="post__details">
        <span className="likes">583 lượt thích</span>
        <div className="caption">
          <span className="username">doc.sach.moi.ngay</span>
          <span className="text">
            <p>hihi</p> <span className="see-more">xem thêm</span>
          </span>
        </div>
        {/* Phần Bình luận (có thể là một component riêng) */}
        <div className="post__comments">
          <div className="view-all-comments" style={{cursor:'pointer'}} onClick={handleShowModal}>Xem tất cả 23 bình luận</div>
          <div className="add-comment">
            <input type="text" placeholder="Bình luận..." />
            <button disabled={true}>Đăng</button>
            <span className="emoji-icon">😊</span>{" "}
            {/* Hoặc sử dụng icon từ thư viện */}
          </div>
        </div>
      </div>
    {showModal && (
      <React.Suspense fallback={<div>Đang tải...</div>}>
        <PostModal onClose={handleCloseModal} post={post} />
      </React.Suspense>
    )}
    </div>
  );
}

export default InstagramPost;
