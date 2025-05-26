import React from "react";
import "./UserComment.css";
import { Link } from "react-router-dom";
function UserComment({ comment, onReply, level = 1, children }) {
  return (
    <div
      className={`user-comment comment-level-${level}`}
      style={{ marginLeft: (level - 1) * 24 }}
    >
      <div className="user-info">
        <div>
          <img src={comment.avatar} alt={comment.username} loading="lazy" />
        </div>
        <div>
          <div>
            <a href="">
              <span>
                <Link
                  to={`/user/${comment.username}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {comment.username}
                </Link>
              </span>{" "}
            </a>
            <span>{comment.text}</span>
          </div>
          <div
            className="user-info"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <p className="time-post" style={{ margin: 0 }}>
              {comment.time}
            </p>
            <button
              className="reply-btn"
              style={{
                background: "none",
                border: "none",
                color: "#3897f0",
                cursor: "pointer",
                fontSize: 13,
                padding: 0,
              }}
              onClick={() => {
                console.log(
                  "UserComment: Bấm trả lời:",
                  comment.id,
                  comment.username
                );
                if (typeof onReply === "function")
                  onReply(comment.id, comment.username);
              }}
            >
              Trả lời
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default UserComment;
