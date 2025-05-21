import React, { useState } from "react";
import styles from "./CreatePost.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Giả lập dữ liệu người dùng (có thể lấy từ props/context)
const user = {
  avatar: "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg", // Thay bằng link avatar thật
  username: "duyhiep523",
};

const visibilityOptions = [
  { label: "Công khai", value: "public" },
  { label: "Bạn bè", value: "friends" },
  { label: "Riêng tư", value: "private" },
];

const CreatePost = () => {
  const [images, setImages] = useState([]); // [{file, url}]

  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Lọc file trùng (theo name + size)
    const newFiles = files.filter(file => !images.some(img => img.file.name === file.name && img.file.size === file.size));
    const newImages = newFiles.map(file => ({ file, url: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImages]);
  };

  const fileInputRef = React.useRef(null);

  const handleRemoveImage = (idx) => {
    setImages(prev => {
      const newArr = prev.filter((_, i) => i !== idx);
      // Nếu xóa hết ảnh thì reset input file để chọn lại cùng ảnh được
      if (newArr.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return newArr;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit bài viết ở đây
    toast.success('Đăng bài thành công!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  return (
    <div className={styles["create-post-container"]}>
      <div className={styles["create-post-header"]}>
        <img className={styles["avatar"]} src={user.avatar} alt="avatar" />
        <div className={styles["user-info"]}>
          <span className={styles["username"]}>{user.username}</span>
          <select
            className={styles["visibility-select"]}
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            {visibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <form className={styles["create-post-form"]} onSubmit={handleSubmit}>
        <label htmlFor="image-upload" className={styles["image-upload-label"]}>
          {images.length > 0 ? (
            <div className={styles["multi-preview-list"]}>
              {images.map((img, idx) => (
                <div key={idx} className={styles["preview-wrapper"]}>
                  <span className={styles["preview-index"]}>{idx + 1}</span>
                  <img src={img.url} alt={`Ảnh xem trước số ${idx + 1}`} className={styles["preview-image-multi"]} tabIndex={0} />
                  <button
  type="button"
  className={styles["remove-img-btn"]}
  onClick={e => {
    e.preventDefault();
    e.stopPropagation();
    handleRemoveImage(idx);
  }}
  aria-label={`Xóa ảnh số ${idx + 1}`}
  tabIndex={0}
>
  &times;
</button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles["upload-empty-state"]}>
              <svg width="48" height="48" fill="#e1306c" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4.18A3 3 0 0 0 7.18 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zm7-14a1 1 0 0 1 1 1v1h-2V7a1 1 0 0 1 1-1zm-7 2h2.18A3 3 0 0 0 13 8h6v10H5V8zm7 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2z"></path></svg>
              <span className={styles["upload-placeholder"]}>Chọn hoặc kéo thả nhiều ảnh vào đây để đăng bài</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>
        <input
          type="text"
          className={styles["title-input"]}
          placeholder="Thêm tiêu đề..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={2200}
        />
        <button type="submit" className={styles["submit-btn"]}>
          Đăng bài
        </button>
      </form>
      <ToastContainer
        theme="dark"
        toastStyle={{
          background: '#23272b',
          color: '#f1f1f1',
          border: '1.5px solid #e1306c',
          boxShadow: '0 2px 12px rgba(0,0,0,0.22)',
        }}
        bodyStyle={{
          color: '#f1f1f1',
          fontWeight: 500,
        }}
        icon={{
          success: <span style={{color: '#fdc468', fontSize: 22}}>✔</span>,
        }}
      />
    </div>
  );
};

export default CreatePost;
