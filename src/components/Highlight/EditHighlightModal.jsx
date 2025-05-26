import React, { useState, useEffect } from "react";
import styles from "./HighlightModal.module.css";
import {
  getHighlightStoryDetail,
  updateHighlightStory,
} from "../../services/highlightServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditHighlightModal({
  highlightId,
  userId,
  onSave,
  onClose,
}) {
  const [name, setName] = useState("");
  // stories sẽ chứa các đối tượng { url, type, file }
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    async function fetchHighlightDetailAndFiles() {
      if (!highlightId || !userId) {
        toast.error("Không có ID highlight hoặc user ID để chỉnh sửa.");
        onClose();
        return;
      }
      setLoading(true);
      try {
        const response = await getHighlightStoryDetail(userId, highlightId);
        const data = response;

        setName(data.storyName);

        const remoteImageUrls = data.imageUrls || [];

        const filesPromises = remoteImageUrls.map(async (imageUrl, index) => {
          try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            const type = blob.type.startsWith("video") ? "video" : "image";
            const fileName =
              imageUrl.substring(imageUrl.lastIndexOf("/") + 1) ||
              `story-${index}.${type.split("/")[1] || "jpg"}`;
            const file = new File([blob], fileName, {
              type: blob.type || `image/jpeg`,
            }); // Sử dụng blob.type nếu có
            return { url: URL.createObjectURL(file), type, file };
          } catch (error) {
            console.error("Lỗi khi tải file từ URL:", imageUrl, error);
            toast.warn(
              `Không thể tải file ${imageUrl.substring(
                imageUrl.lastIndexOf("/") + 1
              )}`
            );
            return null;
          }
        });

        const loadedStories = (await Promise.all(filesPromises)).filter(
          Boolean
        );
        setStories(loadedStories);
      } catch (err) {
        toast.error("Lỗi khi tải chi tiết Highlight: " + err.message);
        onClose();
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    }

    fetchHighlightDetailAndFiles();
  }, [highlightId, userId, onClose]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newStories = files.map((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video") ? "video" : "image";
      return { url, type, file };
    });
    setStories([...stories, ...newStories]);
  };

  const handleRemoveStory = (idx) => {
    if (stories[idx] && stories[idx].url.startsWith("blob:")) {
      URL.revokeObjectURL(stories[idx].url);
    }
    setStories(stories.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Tên tin nổi bật không được để trống!");
      return;
    }
    if (stories.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ảnh/video cho Highlight!");
      return;
    }
    if (!userId || !highlightId) {
      toast.error("Thông tin Highlight không đầy đủ để cập nhật!");
      return;
    }

    setLoading(true);
    try {
      const allFilesToUpload = stories.map((s) => s.file).filter(Boolean);

      if (allFilesToUpload.length === 0) {
        toast.error("Không có ảnh/video hợp lệ để tải lên!");
        setLoading(false);
        return;
      }

      await updateHighlightStory(userId, highlightId, name, allFilesToUpload);

      toast.success("Cập nhật Highlight thành công!");
      if (typeof onSave === "function") {
        onSave(); // Chỉ gọi onSave để trigger re-fetch ở HighlightList
      }
      onClose();
    } catch (err) {
      toast.error("Cập nhật Highlight thất bại: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Thu hồi tất cả các URL object khi component unmount
  useEffect(() => {
    return () => {
      stories.forEach((s) => {
        if (s.url && s.url.startsWith("blob:")) {
          URL.revokeObjectURL(s.url);
        }
      });
    };
  }, [stories]);

  if (!initialLoadComplete && loading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h3>Đang tải chi tiết Highlight...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Chỉnh sửa tin nổi bật</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Tên tin nổi bật</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            required
          />
          {stories[0] && (
            <img
              src={stories[0].url}
              alt="cover"
              className={styles.storyImg}
              style={{ marginBottom: 8 }}
            />
          )}
          <label>Thêm ảnh/video mới từ thiết bị</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
          />
          <div className={styles.storiesList}>
            {stories.map((s, idx) => (
              <div key={idx} className={styles.storyItem}>
                {s.type === "image" ? (
                  <img src={s.url} alt="story" className={styles.storyImg} />
                ) : (
                  <video src={s.url} className={styles.storyImg} controls />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveStory(idx)}
                  className={styles.removeBtn}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
