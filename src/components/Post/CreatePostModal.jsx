import React from "react";
import styles from "./CreatePostModal.module.css";
import CreatePost from "./CreatePost";
import { useNavigate } from 'react-router-dom';

const CreatePostModal = ({ onClose }) => {
  const navigate = useNavigate();


  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  const handlePostCreated = () => {
   
    if (typeof onClose === 'function') {
      onClose();
    }
    setTimeout(() => {
      navigate('/home', { replace: true });
      setTimeout(() => window.location.reload(), 100);
    }, 400);
  };

  return (
    <div className={styles["modal-overlay-create-post"]} onClick={() => {

      if (typeof onClose === 'function') {
        onClose();
      }
    }}>
      <div className={styles["modal-create-post"]} onClick={handleContentClick}>
        <button className={styles["close-btn-create-post"]} onClick={() => {
     
          if (typeof onClose === 'function') {
            onClose();
          }
        }} aria-label="Đóng modal">
          &times;
        </button>
        <CreatePost onPostCreated={handlePostCreated} />
      </div>
    </div>
  );
};

export default CreatePostModal;
