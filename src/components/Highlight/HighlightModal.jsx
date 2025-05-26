import React, { useState } from "react";
import styles from "./HighlightModal.module.css";
import { createHighlightStory } from "../../services/highlightServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HighlightModal({ highlight, onSave, onClose, userId }) {
  const [name, setName] = useState(highlight?.name || "");
  const [stories, setStories] = useState(highlight?.stories || []);
  const [loading, setLoading] = useState(false);

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
    setStories(stories.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || stories.length === 0) {
      toast.error("Vui lòng nhập tên và chọn ít nhất một ảnh/video!");
      return;
    }
    if (!userId) {
      toast.error("Không tìm thấy userId!");
      return;
    }
    setLoading(true);
    try {
      const images = stories.map((s) => s.file).filter(Boolean);
      const result = await createHighlightStory(userId, name, images);
      toast.success("Tạo Highlight thành công!");
      const newId = result?.storyId || result?.id;
      if (typeof onSave === "function") {
        onSave({
          id: newId,
          name,
          cover: stories[0]?.url,
          stories,
        });
      }
      // onSave && onSave({ ...highlight, name, cover: stories[0]?.url, stories });
      onClose();
    } catch (err) {
      toast.error("Tạo Highlight thất bại: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>{highlight ? "Chỉnh sửa" : "Tạo"} tin nổi bật</h3>
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
          <label>Chọn ảnh/video từ thiết bị</label>
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
              {loading ? "Đang lưu..." : "Lưu"}
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
