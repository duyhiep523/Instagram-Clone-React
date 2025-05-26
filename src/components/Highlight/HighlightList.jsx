// HighlightList.jsx
import React, { useState, useEffect } from "react";
import styles from "./HighlightList.module.css";
import { Plus } from "react-feather";
import HighlightModal from "./HighlightModal"; // Giữ lại cho chức năng tạo mới
import EditHighlightModal from "./EditHighlightModal"; // Import component mới
import StorySection from "../Story/StorySection";
import { getAllHighlightStories, deleteHighlightStory } from "../../services/highlightServices";
import { toast } from "react-toastify";

export default function HighlightList({ isOwnProfile = true, userId }) {
  const [highlights, setHighlights] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false); // Đổi tên state cho rõ ràng
  const [showEditModal, setShowEditModal] = useState(false); // State mới cho modal chỉnh sửa
  const [editingHighlightId, setEditingHighlightId] = useState(null); // Lưu ID của highlight đang chỉnh sửa
  const [openHighlight, setOpenHighlight] = useState(null);

  useEffect(() => {
    async function fetchHighlights() {
      try {
        const data = await getAllHighlightStories(userId);
        setHighlights(
          data.map((item) => ({
            id: item.storyId,
            name: item.storyName,
            cover: item.storyImage,
            stories: [], // Dữ liệu API của bạn không trả về stories trong danh sách, nên để trống hoặc fetch riêng nếu cần
          }))
        );
      } catch (err) {
        toast.error("Lỗi tải danh sách Highlight: " + err.message);
      }
    }
    if (userId) fetchHighlights();
  }, [userId]);

  const handleAdd = () => {
    setShowCreateModal(true); // Mở modal tạo mới
  };

  const handleEdit = (hl) => {
    setEditingHighlightId(hl.id); // Lưu ID của highlight cần chỉnh sửa
    setShowEditModal(true); // Mở modal chỉnh sửa
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa highlight này không?")) {
      return;
    }

    try {
      const response = await deleteHighlightStory(userId, id);
      setHighlights(highlights.filter((h) => h.id !== id));
      toast.success(response.message || "Xóa Highlight Story thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa highlight story:", err);
      toast.error(err.message || "Xóa Highlight Story thất bại!");
    }
  };

  // Hàm này sẽ được gọi khi tạo mới HOẶC chỉnh sửa xong highlight
  const handleHighlightSave = () => {
    // Re-fetch lại toàn bộ danh sách để cập nhật UI
    getAllHighlightStories(userId)
      .then(data => setHighlights(data.map((item) => ({
        id: item.storyId,
        name: item.storyName,
        cover: item.storyImage,
        stories: [],
      }))))
      .catch(err => toast.error("Lỗi tải danh sách Highlight: " + err.message));
  };


  return (
    <div className={styles.container}>
      {highlights.map((h) => (
        <div key={h.id} className={styles.highlightItem}>
          <div className={styles.coverWrap} onClick={() => setOpenHighlight(h)}>
            <img
              src={
                h.cover ||
                "https://media.istockphoto.com/id/1370544962/vi/anh/n%E1%BB%81n-gi%E1%BA%A5y-tr%E1%BA%AFng-k%E1%BA%BFt-c%E1%BA%A5u-b%C3%ACa-c%E1%BB%A9ng-s%E1%BB%A3i-%C4%91%E1%BB%83-c%E1%BA%A1o-r%C3%A2u.jpg?s=612x612&w=0&k=20&c=7fuXKUP3PkMIZhFg4MWyov7kxvVh2oFSQ3qBmhtvodw="
              }
              alt={h.name}
              className={styles.coverImg}
            />
          </div>
          <div className={styles.label}>
            <p>{h.name.length > 10 ? h.name.slice(0, 10) + "..." : h.name}</p>
          </div>
          {isOwnProfile && (
            <div className={styles.actions}>
              <button onClick={() => handleEdit(h)} className={styles.editBtn}>
                Sửa
              </button>
              <button
                onClick={() => handleDelete(h.id)}
                className={styles.deleteBtn}
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      ))}
      {isOwnProfile && (
        <div className={styles.highlightAdd} onClick={handleAdd}>
          <div className={styles.addIcon}>
            <Plus color="#fff" size={30} />
          </div>
          <div className={styles.addLabel}>
            <p>Mới</p>
          </div>
        </div>
      )}

      {/* Modal tạo mới */}
      {showCreateModal && (
        <HighlightModal
          onSave={() => {
            handleHighlightSave(); // Gọi hàm xử lý sau khi tạo/sửa xong
            setShowCreateModal(false);
          }}
          onClose={() => setShowCreateModal(false)}
          userId={userId}
        />
      )}

      {/* Modal chỉnh sửa */}
      {showEditModal && (
        <EditHighlightModal
          highlightId={editingHighlightId} // Truyền ID của highlight cần chỉnh sửa
          onSave={() => {
            handleHighlightSave(); // Gọi hàm xử lý sau khi tạo/sửa xong
            setShowEditModal(false);
          }}
          onClose={() => setShowEditModal(false)}
          userId={userId}
        />
      )}

      {openHighlight && (
        <div
          className={styles.storyModalOverlay}
          onClick={() => setOpenHighlight(null)}
        >
          <div
            className={styles.storyModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <StorySection userId={userId} storyId={openHighlight.id} />
          </div>
        </div>
      )}
    </div>
  );
}