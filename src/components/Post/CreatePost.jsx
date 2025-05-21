import React, { useState } from "react";
import styles from "./CreatePost.module.css"; // Đảm bảo đường dẫn CSS đúng
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultAvatar = "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg";

const visibilityOptions = [
  { label: "Công khai", value: "public" },
  { label: "Bạn bè", value: "friends" },
  { label: "Riêng tư", value: "private" },
];

const CreatePost = ({ onPostCreated }) => {
  const [images, setImages] = useState([]); // [{file, url}]
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const fileInputRef = React.useRef();

  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setUserInfo(null);
      setUserLoading(false);
      return;
    }
    setUserLoading(true);
    // Dynamic import để tránh lỗi vòng lặp phụ thuộc nếu userService phụ thuộc vào các module khác
    import('../../services/userService').then(({ getUserById }) => {
      getUserById(userId)
        .then(data => setUserInfo(data))
        .catch(() => setUserInfo(null))
        .finally(() => setUserLoading(false));
    });
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Lọc file trùng (theo name + size) để tránh thêm ảnh trùng lặp
    const newFiles = files.filter(file => !images.some(img => img.file.name === file.name && img.file.size === file.size));
    const newImages = newFiles.map(file => ({ file, url: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (idx) => {
    setImages(prev => {
      const newArr = prev.filter((_, i) => i !== idx);
      // Nếu không còn ảnh nào, reset input file để có thể chọn lại cùng một file
      if (newArr.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return newArr;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    // Kiểm tra userId
    if (!userId) {
      toast.error('Không tìm thấy userId! Vui lòng đăng nhập.', {
        style: {
          background: '#ff4d4f',
          color: '#fff',
          fontWeight: 600,
          border: '2px solid #ff4d4f',
          boxShadow: '0 2px 12px rgba(255,77,79,0.18)'
        },
        icon: <span style={{ color: '#ff4d4f', fontSize: 22 }}>✖</span>
      });
      return;
    }

    // Kiểm tra xem có ảnh nào được chọn không
    if (images.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ảnh!', {
        style: {
          background: '#ff4d4f',
          color: '#fff',
          fontWeight: 600,
          border: '2px solid #ff4d4f',
          boxShadow: '0 2px 12px rgba(255,77,79,0.18)'
        },
        icon: <span style={{ color: '#ff4d4f', fontSize: 22 }}>✖</span>
      });
      return;
    }

    setLoading(true); // Bắt đầu trạng thái loading
    try {
      // Dynamic import cho postService
      await import('../../services/postService').then(async ({ createPost }) => {
        await createPost({
          userId,
          content: title,
          privacy: visibility,
          files: images.map(img => img.file)
        });
      });

      toast.success('Đăng bài thành công!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#22c55e', 
          color: '#fff',
          fontWeight: 600,
          border: '2px solid #22c55e',
          boxShadow: '0 2px 12px rgba(34,197,94,0.18)'
        },
        icon: <span style={{ color: '#22c55e', fontSize: 22 }}>✔</span>,
      });

   
      if (typeof onPostCreated === 'function') {
        onPostCreated();
      } 

      // Reset form sau khi đăng bài thành công
    

    } catch (err) {
    

     
      toast.error(err?.message || 'Đăng bài thất bại!', {
        style: {
          background: '#ff4d4f',
          color: '#fff',
          fontWeight: 600,
          border: '2px solid #ff4d4f',
          boxShadow: '0 2px 12px rgba(255,77,79,0.18)'
        },
        icon: <span style={{ color: '#ff4d4f', fontSize: 22 }}>✖</span>
      });
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <div className={styles["create-post-container"]}>
      <div className={styles["create-post-header"]}>
        {/* Hiển thị avatar người dùng hoặc avatar mặc định */}
        <img className={styles["avatar"]} src={userInfo?.profilePictureUrl || defaultAvatar} alt="avatar" />
        <div className={styles["user-info"]}>
          {/* Hiển thị tên người dùng hoặc ID */}
          <span className={styles["username"]}>{userInfo?.username || localStorage.getItem('userId') || 'Người dùng'}</span>
          {/* Dropdown chọn quyền riêng tư của bài đăng */}
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
        {/* Vùng chọn ảnh, có thể click hoặc kéo thả */}
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
              {/* Icon và placeholder khi chưa có ảnh */}
              <svg width="48" height="48" fill="#e1306c" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4.18A3 3 0 0 0 7.18 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zm7-14a1 1 0 0 1 1 1v1h-2V7a1 1 0 0 1 1-1zm-7 2h2.18A3 3 0 0 0 13 8h6v10H5V8zm7 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2z"></path></svg>
              <span className={styles["upload-placeholder"]}>Chọn hoặc kéo thả nhiều ảnh vào đây để đăng bài</span>
            </div>
          )}
          {/* Input file ẩn để chọn ảnh */}
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
        {/* Input cho tiêu đề bài đăng */}
        <input
          type="text"
          className={styles["title-input"]}
          placeholder="Thêm tiêu đề..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={2200}
        />
        {/* Nút đăng bài, hiển thị spinner khi đang loading */}
        <button type="submit" className={styles["submit-btn"]} disabled={loading}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={styles["spinner"]} style={{ width: 18, height: 18, border: '2px solid #fff', borderTop: '2px solid #e1306c', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
              Đang đăng...
            </span>
          ) : (
            'Đăng bài'
          )}
        </button>
        {/* CSS cho animation spinner */}
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </form>
      {/* ToastContainer để hiển thị thông báo */}
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={2}
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
          success: <span style={{ color: '#fdc468', fontSize: 22 }}>✔</span>,
        }}
      />
    </div>
  );
};

export default CreatePost;
