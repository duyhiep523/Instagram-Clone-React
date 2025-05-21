import React from "react";
import styles from "./CreatePostModal.module.css";
import CreatePost from "./CreatePost";

const CreatePostModal = ({ onClose }) => {
  // Dừng sự kiện nổi bọt khi click vào modal content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className={styles["modal-overlay-create-post"]} onClick={onClose}>
      <div className={styles["modal-create-post"]} onClick={handleContentClick}>
        <button className={styles["close-btn-create-post"]} onClick={onClose} aria-label="Đóng modal">
          &times;
        </button>
        <CreatePost />
      </div>
    </div>
  );
};

export default CreatePostModal;
