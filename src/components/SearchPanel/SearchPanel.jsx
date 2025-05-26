import React, { useEffect, useRef, useState } from "react";
import styles from "./SearchPanel.module.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import { searchUsers } from "../../services/searchService";
import { Link, useNavigate } from "react-router-dom";

function SearchPanel({ onClose }) {
  const navigate = useNavigate();
  const panelRef = useRef();
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState([
    // Có thể lấy từ localStorage nếu muốn lưu lâu dài
    { username: "duyhiep523", name: "Duy Hiep", avatar: "https://i.imgur.com/your-avatar.jpg" },
    { username: "cat.cute", name: "Mèo Cute", avatar: "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg" },
  ]);
  const [showClearAll, setShowClearAll] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef();

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
    setSearch("");
    setRecent(prev => [user, ...prev.filter(u => u.username !== user.username)].slice(0, 6));
    onClose();
    navigate(`/user/${user.username}`);
  };

  // Debounce search
  useEffect(() => {
    if (!search) {
      setResults([]);
      setLoading(false);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchUsers(search)
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          setError("Lỗi tìm kiếm. Vui lòng thử lại.");
          setResults([]);
          setLoading(false);
        });
    }, 400);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [search]);

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
          loading ? (
            <div className={styles['search-empty']}>Đang tìm kiếm...</div>
          ) : error ? (
            <div className={styles['search-empty']}>{error}</div>
          ) : results.length === 0 ? (
            <div className={styles['search-empty']}>Không tìm thấy kết quả.</div>
          ) : (
            <ul className={styles['search-list']}>
              {results.map(user => (
                <li
                  key={user.userId}
                  className={styles['search-list-item']}
                  onClick={() => handleSelectUser({
                    username: user.username,
                    name: user.fullName,
                    avatar: user.profilePictureUrl
                  })}
                >
                  <Link to={`/user/${user.username}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', width: '100%' }} onClick={e => { e.preventDefault(); handleSelectUser({ username: user.username, name: user.fullName, avatar: user.profilePictureUrl }); }}>
                    <img src={user.profilePictureUrl} alt={user.username} className={styles['search-avatar']} />
                    <div className={styles['search-user-info']}>
                      <span className={styles['search-username']}>{user.username}</span>
                      <span className={styles['search-name']}>{user.fullName}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}

export default SearchPanel;
