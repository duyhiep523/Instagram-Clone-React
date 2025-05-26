import React, { useState, useEffect, useRef } from "react";
import styles from "./CreatePost.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const defaultAvatar =
  "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg";

const visibilityOptions = [
  { label: "Công khai", value: "PUBLIC" },
  { label: "Bạn bè", value: "FRIENDS" },
  { label: "Riêng tư", value: "PRIVATE" },
];

const UpdatePost = ({ postId, onPostUpdated }) => {
  const [images, setImages] = useState([]); // [{file, url} hoặc {url}]
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);

  const fileInputRef = useRef();

  // Lấy thông tin user
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setUserInfo(null);
      setUserLoading(false);
      return;
    }
    setUserLoading(true);
    import("../../services/userService").then(({ getUserById }) => {
      getUserById(userId)
        .then((data) => setUserInfo(data))
        .catch(() => setUserInfo(null))
        .finally(() => setUserLoading(false));
    });
  }, []);

  // Lấy dữ liệu bài viết
  useEffect(() => {
    if (!postId) {
      setPostLoading(false);
      return;
    }
    setPostLoading(true);
    import("../../services/userService").then(async ({ getPostDetailById }) => {
      try {
        const postData = await getPostDetailById(postId);
        setContent(postData.content || "");
        setPrivacy(postData.privacy || "public");
        setImages((postData.fileUrls || []).map((url) => ({ url })));
      } catch (error) {
        toast.error("Không thể tải bài viết!", {
          style: {
            background: "#ff4d4f",
            color: "#fff",
            fontWeight: 600,
            border: "2px solid #ff4d4f",
            boxShadow: "0 2px 12px rgba(255,77,79,0.18)",
          },
          icon: <span style={{ color: "#ff4d4f", fontSize: 22 }}>✖</span>,
        });
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setPostLoading(false);
      }
    });
  }, [postId]);

  // Thêm ảnh mới
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Lọc file trùng lặp theo tên và size
    const newFiles = files.filter(
      (file) =>
        !images.some(
          (img) =>
            (img.file &&
              img.file.name === file.name &&
              img.file.size === file.size) ||
            img.url === URL.createObjectURL(file)
        )
    );
    const newImages = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Xóa ảnh khỏi preview
  const handleRemoveImage = (idx) => {
    setImages((prev) => {
      const newArr = prev.filter((_, i) => i !== idx);
      if (newArr.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return newArr;
    });
  };

  // Gửi form: chỉ lấy tất cả images (file hoặc url) và gửi vào files

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Không tìm thấy userId! Vui lòng đăng nhập.");
      return;
    }
    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh!");
      return;
    }
    setLoading(true);
    try {
      // Chuyển tất cả ảnh thành File object
      const files = await Promise.all(
        images.map(async (img, idx) => {
          if (img.file) return img.file; // Ảnh mới
          // Ảnh cũ: fetch về và chuyển thành file
          const res = await fetch(img.url);
          const blob = await res.blob();
          // Lấy tên file từ url hoặc đặt tên mặc định
          const filename = img.url.split("/").pop() || `image-${idx}.jpg`;
          return new File([blob], filename, {
            type: blob.type || "image/jpeg",
          });
        })
      );

      await import("../../services/postService").then(
        async ({ updatePost }) => {
          await updatePost({
            postId,
            userId,
            content,
            privacy,
            files, // Chỉ gửi file
          });
        }
      );
      toast.success("Cập nhật bài viết thành công!");
      if (typeof onPostUpdated === "function") {
        onPostUpdated();
      }
    } catch (err) {
      toast.error(err?.message || "Cập nhật bài viết thất bại!");
    } finally {
      setLoading(false);
    }
  };
  if (postLoading || userLoading) {
    return (
      <div
        className={styles["create-post-container"]}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <span
          className={styles["spinner"]}
          style={{
            width: 40,
            height: 40,
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #e1306c",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles["create-post-container"]}>
      <div className={styles["create-post-header"]}>
        <img
          className={styles["avatar"]}
          src={userInfo?.profilePictureUrl || defaultAvatar}
          alt="avatar"
        />
        <div className={styles["user-info"]}>
          <span className={styles["username"]}>
            {userInfo?.username ||
              localStorage.getItem("userId") ||
              "Người dùng"}
          </span>
          <select
            className={styles["visibility-select"]}
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
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
                <div key={img.url + idx} className={styles["preview-wrapper"]}>
                  <span className={styles["preview-index"]}>{idx + 1}</span>
                  <img
                    src={img.url}
                    alt={`Ảnh xem trước số ${idx + 1}`}
                    className={styles["preview-image-multi"]}
                    tabIndex={0}
                  />
                  <button
                    type="button"
                    className={styles["remove-img-btn"]}
                    onClick={(e) => {
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
              <svg
                width="48"
                height="48"
                fill="#e1306c"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4.18A3 3 0 0 0 7.18 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zm7-14a1 1 0 0 1 1 1v1h-2V7a1 1 0 0 1 1-1zm-7 2h2.18A3 3 0 0 0 13 8h6v10H5V8zm7 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2z"></path>
              </svg>
              <span className={styles["upload-placeholder"]}>
                Chọn hoặc kéo thả nhiều ảnh vào đây để đăng bài
              </span>
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2200}
        />
        <button
          type="submit"
          className={styles["submit-btn"]}
          disabled={loading}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className={styles["spinner"]}
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid #fff",
                  borderTop: "2px solid #e1306c",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                }}
              />
              Đang cập nhật...
            </span>
          ) : (
            "Cập nhật bài viết"
          )}
        </button>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </form>
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
          background: "#23272b",
          color: "#f1f1f1",
          border: "1.5px solid #e1306c",
          boxShadow: "0 2px 12px rgba(0,0,0,0.22)",
        }}
        bodyStyle={{
          color: "#f1f1f1",
          fontWeight: 500,
        }}
        icon={{
          success: <span style={{ color: "#fdc468", fontSize: 22 }}>✔</span>,
        }}
      />
    </div>
  );
};

export default UpdatePost;
