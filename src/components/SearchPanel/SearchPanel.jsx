import React, { useEffect, useRef, useState } from "react";
import styles from "./SearchPanel.module.css";
import { FaSearch, FaTimes } from "react-icons/fa";

const MOCK_SUGGESTIONS = [
  { username: "duyhiep523", name: "Duy Hiep", avatar: "https://i.imgur.com/your-avatar.jpg" },
  { username: "cat.cute", name: "Mèo Cute", avatar: "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg" },
  { username: "insta_girl", name: "Insta Girl", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { username: "johnny", name: "Johnny", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
];

function SearchPanel({ onClose }) {
  const panelRef = useRef();
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState([
    { username: "duyhiep523", name: "Duy Hiep", avatar: "https://i.imgur.com/your-avatar.jpg" },
    { username: "cat.cute", name: "Mèo Cute", avatar: "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg" },
  ]);
  const [showClearAll, setShowClearAll] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleRemoveRecent = (username) => {
    setRecent(prev => prev.filter(user => user.username !== username));
  };

  const handleClearAll = () => {
    setRecent([]);
  };

  const handleSelectUser = (user) => {
    alert(`Xem trang cá nhân: ${user.username}`);
    setSearch("");
    setRecent(prev => [user, ...prev.filter(u => u.username !== user.username)].slice(0, 6));
    onClose();
  };

  const filteredSuggestions = search
    ? MOCK_SUGGESTIONS.filter(
        s =>
          s.username.toLowerCase().includes(search.toLowerCase()) ||
          s.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className={`${styles['search-panel']} ${styles['slide-in']}`} ref={panelRef}>
      <div className={styles['search-header']}>
        <div className={styles['search-header-row']}>
          <h2>Tìm kiếm</h2>
          <button className={styles['close-btn']} onClick={onClose}><FaTimes /></button>
        </div>
        <div className={styles['search-content']}>
          <FaSearch className={styles['search-icon']} />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className={styles['search-input']}
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <div className={styles['search-list-area']}>
        {search === "" ? (
          <>
            <div className={styles['search-list-header']}>
              <span>Tìm kiếm gần đây</span>
              {recent.length > 0 && (
                <button className={styles['clear-all-btn']} onClick={handleClearAll}>Xóa tất cả</button>
              )}
            </div>
            {recent.length === 0 ? (
              <div className={styles['search-empty']}>Không có lịch sử tìm kiếm.</div>
            ) : (
              <ul className={styles['search-list']}>
                {recent.map(user => (
                  <li
                    key={user.username}
                    className={styles['search-list-item']}
                    onClick={() => handleSelectUser(user)}
                  >
                    <img src={user.avatar} alt={user.username} className={styles['search-avatar']} />
                    <div className={styles['search-user-info']}>
                      <span className={styles['search-username']}>{user.username}</span>
                      <span className={styles['search-name']}>{user.name}</span>
                    </div>
                    <button
                      className={styles['remove-recent-btn']}
                      onClick={e => { e.stopPropagation(); handleRemoveRecent(user.username); }}
                      title="Xóa khỏi lịch sử"
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            {filteredSuggestions.length === 0 ? (
              <div className={styles['search-empty']}>Không tìm thấy kết quả.</div>
            ) : (
              <ul className={styles['search-list']}>
                {filteredSuggestions.map(user => (
                  <li
                    key={user.username}
                    className={styles['search-list-item']}
                    onClick={() => handleSelectUser(user)}
                  >
                    <img src={user.avatar} alt={user.username} className={styles['search-avatar']} />
                    <div className={styles['search-user-info']}>
                      <span className={styles['search-username']}>{user.username}</span>
                      <span className={styles['search-name']}>{user.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPanel;
