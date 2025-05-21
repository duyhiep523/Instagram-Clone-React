import React, { useState } from 'react';
import styles from './HighlightList.module.css';
import { Plus } from 'react-feather';
import HighlightModal from './HighlightModal';
import StorySection from '../Story/StorySection';

const initialHighlights = [
  {
    id: 1,
    name: 'Bạn bè',
    cover: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482740TZa/anh-mo-ta.png',
    stories: [
      { url: 'https://cdn.thuonggiaonline.vn/images/482dfd0421db0ab46c65f584701733dc9d94ba57943d49ad47cce99616522a66787fc51bae8e1849c40832d35dac6673fba0f2c2ef384fc8e2625fc06ca03b8afbb39e414ce2bd430f85da797baf343282483a3d85cac1fb103efeb555e8dd7f/cach-trang-diem-sieu-thuc-nhu-karina-aespa-0-1024x1280.jpg', type: 'image' }
    ]
  }
];

export default function HighlightList({ isOwnProfile = true }) {
  const [highlights, setHighlights] = useState(initialHighlights);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [openHighlight, setOpenHighlight] = useState(null);

  const handleAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (hl) => {
    setEditing(hl);
    setShowModal(true);
  };

  const handleSave = (hl) => {
    if (hl.id) {
      setHighlights(highlights.map(h => h.id === hl.id ? hl : h));
    } else {
      setHighlights([...highlights, { ...hl, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  return (
    <div className={styles.container}>
      {highlights.map(h => (
        <div key={h.id} className={styles.highlightItem}>
          <div className={styles.coverWrap} onClick={() => setOpenHighlight(h)}>
            <img src={h.cover} alt={h.name} className={styles.coverImg} />
          </div>
          <div className={styles.label}>{h.name}</div>
          {isOwnProfile && (
            <div className={styles.actions}>
              <button onClick={() => handleEdit(h)} className={styles.editBtn}>Sửa</button>
              <button onClick={() => handleDelete(h.id)} className={styles.deleteBtn}>Xóa</button>
            </div>
          )}
        </div>
      ))}
      {isOwnProfile && (
        <div className={styles.highlightAdd} onClick={handleAdd}>
          <div className={styles.addIcon}><Plus color="#fff" size={30} /></div>
          <div className={styles.addLabel}><p>Mới</p></div>
        </div>
      )}
      {showModal && (
        <HighlightModal
          highlight={editing}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
      {openHighlight && (
        <div className={styles.storyModalOverlay} onClick={() => setOpenHighlight(null)}>
          <div className={styles.storyModalContent} onClick={e => e.stopPropagation()}>
            <StorySection
              stories={openHighlight.stories.map(s => ({
                content: () => <img src={s.url} style={{width: '100%', height: '100%'}} alt="" />
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
