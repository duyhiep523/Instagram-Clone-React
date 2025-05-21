import React, { useState } from 'react';
import styles from './HighlightModal.module.css';

export default function HighlightModal({ highlight, onSave, onClose }) {
  const [name, setName] = useState(highlight?.name || '');
  const [stories, setStories] = useState(highlight?.stories || []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newStories = files.map(file => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      return { url, type, file };
    });
    setStories([...stories, ...newStories]);
  };
  const handleRemoveStory = (idx) => {
    setStories(stories.filter((_, i) => i !== idx));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || stories.length === 0) return;
    const cover = stories[0]?.url || '';
    onSave({ ...highlight, name, cover, stories });
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3>{highlight ? 'Chỉnh sửa' : 'Tạo'} tin nổi bật</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Tên tin nổi bật</label>
          <input value={name} onChange={e => setName(e.target.value)} maxLength={20} required />
         
          {stories[0] && (
            <img src={stories[0].url} alt="cover" className={styles.storyImg} style={{marginBottom:8}} />
          )}
          <label>Chọn ảnh/video từ thiết bị</label>
          <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} />
          <div className={styles.storiesList}>
            {stories.map((s, idx) => (
              <div key={idx} className={styles.storyItem}>
                {s.type === 'image' ? (
                  <img src={s.url} alt="story" className={styles.storyImg} />
                ) : (
                  <video src={s.url} className={styles.storyImg} controls />
                )}
                <button type="button" onClick={() => handleRemoveStory(idx)} className={styles.removeBtn}>X</button>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Lưu</button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
