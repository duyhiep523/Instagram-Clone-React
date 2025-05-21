// DEMO DATA: Bài viết nhiều ảnh/video
export const demoPost = {
  id: 1,
  images: [
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      type: "image"
    },
    {
      url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
      type: "image"
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: "video"
    }
  ],
  imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // fallback ảnh đầu
  likes: 123,
  comments: 4,
  caption: "Đây là caption demo cho bài viết nhiều ảnh/video",
  user: {
    username: "duyhiep523",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/1/12/230601_Karina_%28aespa%29.jpg",
    location: "Potique Hotel"
  },
  commentsData: [
    {
      username: "alice",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      text: "Bức ảnh này thật tuyệt!",
      time: "2 phút",
      replies: [
        {
          username: "bob",
          avatar: "https://randomuser.me/api/portraits/men/12.jpg",
          text: "Đồng ý với @alice luôn!",
          time: "1 phút",
          replies: [
            {
              username: "carol",
              avatar: "https://randomuser.me/api/portraits/women/13.jpg",
              text: "@bob @alice chuẩn luôn!",
              time: "vừa xong"
            }
          ]
        }
      ]
    },
    {
      username: "david",
      avatar: "https://randomuser.me/api/portraits/men/14.jpg",
      text: "Like mạnh!",
      time: "5 phút"
    },
    {
      username: "eva",
      avatar: "https://randomuser.me/api/portraits/women/15.jpg",
      text: "Quá đẹp!",
      time: "7 phút"
    }
  ]
};

import React from "react";
import "./PostModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faBookmark,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CommentList from "../../components/Comment/CommentList"; // Import CommentList component

const PostModal = ({ onClose, post }) => {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [liked, setLiked] = React.useState(false);
  const [showHeart, setShowHeart] = React.useState(false);
  const [commentInput, setCommentInput] = React.useState("");
  const [replyTags, setReplyTags] = React.useState([]);
  React.useEffect(() => { setCurrentIdx(0); setCommentInput(""); setReplyTags([]); }, [post]);
  if (!post) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="post-image" style={{height:'100%', display:'flex', alignItems:'stretch'}}>
          {Array.isArray(post.images) && post.images.length > 0 ? (
            <div className="carousel" style={{position:'relative', width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
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
                style={{cursor:'pointer', width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center', position:'relative'}}
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
                  style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:8}}
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
              alt={`Bài viết ${post.id}`}
            />
          )}
        </div>
        <div className="post-details">
          <div className="post-header">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/12/230601_Karina_%28aespa%29.jpg"
              alt="Avatar"
              className="avatar"
            />
            <div className="user-info">
              <span className="username">uknow_yeaji</span>
              <span className="location">Potique Hotel</span>
            </div>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="post-caption">
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/12/230601_Karina_%28aespa%29.jpg"
                alt="Avatar"
              />
            </div>
            <div>
              <span className="username">duyhiep523</span>
              <span className="caption-text">
                Đây là caption của bài viết {post.id}
              </span>
              <p className="time-post">1 giờ</p>
            </div>
          </div>
          <CommentList
            comments={post.commentsData || demoPost.commentsData}
            onReply={(username, level) => {
              setReplyTags(prev => {
                let newTags = [...prev];
                // Nếu đã có username thì không thêm lại, nếu quá 3 thì chỉ lấy 3 cuối
                if (!newTags.includes(username)) newTags.push(username);
                if (newTags.length > 3) newTags = newTags.slice(newTags.length-3);
                return newTags;
              });
              setCommentInput(prev => {
                // Tự động thêm các @username đầu input, không trùng lặp
                const tags = [...new Set([...replyTags, username])].slice(-3);
                return `@${tags.join(' @')} `;
              });
            }}
          />
          <div className="small-interaction-container">
            <div className="icons">
              <div className="left-icons">
                <FontAwesomeIcon icon={faHeart} />
                <FontAwesomeIcon icon={faComment} />
                <FontAwesomeIcon icon={faPaperPlane} />
              </div>
              <div className="right-icons">
                <FontAwesomeIcon icon={faBookmark} />
              </div>
            </div>
            <div className="likes-time">
              <p className="like-count-postmodal">{post.likes} lượt thích</p>
              <p>{post.comments} bình luận</p>
            </div>
            <div className="comment-input">
              <div className="emoji-icon">
               
                <span>😊</span>
              </div>
              <input
                type="text"
                placeholder="Bình luận..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
              />
              <button>Đăng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
