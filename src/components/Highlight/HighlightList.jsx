import React, { useState, useEffect } from "react";
import styles from "./HighlightList.module.css";
import { Plus } from "react-feather";
import HighlightModal from "./HighlightModal";
import StorySection from "../Story/StorySection";
import { getAllHighlightStories } from "../../services/highlightServices";
import { toast } from "react-toastify";

export default function HighlightList({ isOwnProfile = true, userId }) {
  const [highlights, setHighlights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
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
            stories: [],
          }))
        );
      } catch (err) {
        toast.error("Lỗi tải danh sách Highlight: " + err.message);
      }
    }
    if (userId) fetchHighlights();
  }, [userId]);

  const handleAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (hl) => {
    setEditing(hl);
    setShowModal(true);
  };

  // const handleSave = (hl) => {
  //   if (hl.id) {
  //     setHighlights(highlights.map((h) => (h.id === hl.id ? hl : h)));
  //   } else {
  //     setHighlights([...highlights, { ...hl, id: Date.now() }]);
  //   }
  //   setShowModal(false);
  // };

  const handleDelete = (id) => {
    setHighlights(highlights.filter((h) => h.id !== id));
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
      {showModal && (
        <HighlightModal
          highlight={editing}
          onSave={(hl) => {
            setHighlights([...highlights, hl]);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
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
