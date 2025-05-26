import React from "react";
import styles from "./CreatePostModal.module.css";
import UpdatePost from "./UpdatePost";
import { useNavigate } from "react-router-dom";

const UpdatePostModal = ({ postId, onClose }) => {
  const navigate = useNavigate();
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  const handlePostUpdated = () => {
    if (typeof onClose === "function") {
      onClose(); 
    }
    setTimeout(() => {
      navigate("/home", { replace: true });
      setTimeout(() => window.location.reload(), 100); 
    }, 400);
  };

  return (
    <div
      className={styles["modal-overlay-create-post"]}
      onClick={() => {
        if (typeof onClose === "function") {
          onClose();
        }
      }}
    >
      <div className={styles["modal-create-post"]} onClick={handleContentClick}>
        <button
          className={styles["close-btn-create-post"]}
          onClick={() => {
            if (typeof onClose === "function") {
              onClose();
            }
          }}
          aria-label="Đóng modal"
        >
          &times;
        </button>
        <UpdatePost postId={postId} onPostUpdated={handlePostUpdated} />
      </div>
    </div>
  );
};

export default UpdatePostModal;
