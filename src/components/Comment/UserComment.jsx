import React from "react";
import "./UserComment.css"; // Import file CSS (nếu có)

function UserComment({ comment, onReply, level = 1, children }) {
  return (
    <div className={`user-comment comment-level-${level}`} style={{marginLeft: (level-1)*24}}>
      <div className="user-info">
        <div>
          <img src={comment.avatar} alt={comment.username} />
        </div>      
        <div>
          <div>
            <a href="">
              <span>{comment.username}</span>{" "}
            </a>
            <span>{comment.text}</span>
          </div>
          <div className="user-info" style={{display:'flex', alignItems:'center', gap:8}}>
            <p className="time-post" style={{margin:0}}>{comment.time}</p>
            <button
              className="reply-btn"
              style={{background:'none', border:'none', color:'#3897f0', cursor:'pointer', fontSize:13, padding:0}}
              onClick={() => onReply && onReply(comment.username, level)}
            >Trả lời</button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default UserComment;
