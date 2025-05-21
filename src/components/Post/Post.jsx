import React from "react";
import "./Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";

import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";


import { getFeedByUserId } from '../../services/feedService';

import { getUserById } from '../../services/userService';

import { formatTime } from '../../utils/time';

export function Post({ post, onClick }) {
  const [showModal, setShowModal] = React.useState(false);
  const PostModal = React.lazy(() => import('../../Modal/Post/PostModal'));
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [liked, setLiked] = React.useState(false);
  const [showHeart, setShowHeart] = React.useState(false);
  const [author, setAuthor] = React.useState(null);
  const [authorLoading, setAuthorLoading] = React.useState(true);

  React.useEffect(() => {
    let ignore = false;
    setAuthorLoading(true);
    getUserById(post.userId)
      .then(data => { if (!ignore) { setAuthor(data); setAuthorLoading(false); } })
      .catch(() => { if (!ignore) setAuthorLoading(false); });
    return () => { ignore = true; };
  }, [post.userId]);

  return (
    <div className="instagram-post">
      <div className="post__header">
        <div className="header__info">
          <div className="avatar">
            {authorLoading ? (
              <div style={{width:40,height:40,borderRadius:'50%',background:'#eee'}} />
            ) : (
              <img
                src={author?.profilePictureUrl || "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg"}
                alt="Avatar"
                loading="lazy"
                style={{width:40,height:40,borderRadius:'50%',objectFit:'cover'}}
              />
            )}
          </div>
          <p>
            <span className="username">
              {authorLoading ? <span style={{background:'#eee',width:80,height:16,display:'inline-block',borderRadius:4}} /> : (author?.username || post.userId)}
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
          <div className="carousel" style={{position:'relative', width:'100%', height:480, display:'flex', justifyContent:'center', alignItems:'center', overflow:'hidden', background:'#18191a'}}>
            {post.fileUrls.length > 1 && (
              <button
                className="carousel-btn prev"
                style={{position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', zIndex:2, width:24, height:24, fontSize:18, padding:0, background:'rgba(0,0,0,0.18)'}}
                onClick={e => { e.stopPropagation(); setCurrentIdx((prev) => (prev === 0 ? post.fileUrls.length - 1 : prev - 1)); }}
                aria-label="prev"
              ><FiChevronLeft size={18} /></button>
            )}
            <div
              className="carousel-media"
              style={{cursor:'pointer', width:'100%', display:'flex', justifyContent:'center', position:'relative'}}
              onDoubleClick={e => {
                e.stopPropagation();
                if (!liked) setLiked(true);
                setShowHeart(true);
                setTimeout(() => setShowHeart(false), 700);
              }}
            >
              <img
                src={post.fileUrls[currentIdx]}
                alt={`Ảnh ${currentIdx + 1}`}
                className="carousel-img"
                loading="lazy"
                style={{width:'100%', height:480, objectFit:'cover', borderRadius:8, background:'#222'}}
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
            {post.fileUrls.length > 1 && (
              <button
                className="carousel-btn next"
                style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', zIndex:2, width:24, height:24, fontSize:18, padding:0, background:'rgba(0,0,0,0.18)'}}
                onClick={e => { e.stopPropagation(); setCurrentIdx((prev) => (prev === post.fileUrls.length - 1 ? 0 : prev + 1)); }}
                aria-label="next"
              ><FiChevronRight size={18} /></button>
            )}
            <div className="carousel-dots">
              {post.fileUrls.map((img, idx) => (
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
            loading="lazy"
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
        <span className="likes">{post.likeCount} lượt thích</span>
        <div className="caption">
          <span className="username">{post.username || post.userId}</span>
          <span className="text">
            <p>{post.content}</p>
          </span>
        </div>
        {/* Phần Bình luận (có thể là một component riêng) */}
        <div className="post__comments">
          <div className="view-all-comments" style={{cursor:'pointer'}} onClick={() => setShowModal(true)}>
            Xem tất cả {post.commentCount} bình luận
          </div>
          <div className="add-comment">
            <input type="text" placeholder="Bình luận..." />
            <button disabled={true}>Đăng</button>
            <span className="emoji-icon">😊</span>{" "}
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
    // Lấy userId từ localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Không tìm thấy userId!');
      setLoading(false);
      return;
    }
    getFeedByUserId(userId)
      .then(data => { if (!ignore) setPosts(data); })
      .catch(err => { if (!ignore) setError('Lỗi tải feed!'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  if (loading) return <div>Đang tải bài viết...</div>;
  if (error) return <div>{error}</div>;
  if (!posts.length) return <div>Không có bài viết nào!</div>;

  return (
    <div>
      {posts.map(post => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
}



