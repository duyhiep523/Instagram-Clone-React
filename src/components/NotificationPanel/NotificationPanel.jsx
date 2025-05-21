import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./NotificationPanel.css";

// Demo data
const MOCK_REQUESTS = [
  { username: "renacademy.vn", name: "Yêu cầu theo dõi", avatar: "https://i.pravatar.cc/150?img=11" },
];
const MOCK_NOTIFICATIONS = [
  { id: 1, content: "duchy0605 đã bắt đầu theo dõi bạn.", avatar: "https://i.pravatar.cc/150?img=12", time: "3 ngày" },
  { id: 2, content: "nanie_ntn đã nhắc đến bạn trong bình luận", avatar: "https://i.pravatar.cc/150?img=13", time: "8 tuần" },
  { id: 3, content: "miu.qnh đã thích bình luận của bạn", avatar: "https://i.pravatar.cc/150?img=14", time: "8 tuần" },
];

function NotificationPanel({ onClose }) {
  const panelRef = useRef();
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="notification-panel slide-in" ref={panelRef}>
      <div className="notification-header">
        <h2>Thông báo</h2>
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
      </div>
      <div className="notification-section follow-request">
        <div className="section-title follow-request-title" onClick={() => setShowRequests(open => !open)} style={{cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span>Yêu cầu theo dõi</span>
          <span style={{fontWeight:600,color:'#3897f0',marginLeft:8}}>{MOCK_REQUESTS.length > 0 ? MOCK_REQUESTS.length : ''} người </span>
          <span style={{marginLeft:10,transition:'transform 0.2s',transform: showRequests ? 'rotate(90deg)' : 'rotate(0deg)'}}>▶</span>
        </div>
        {showRequests && (
          MOCK_REQUESTS.length === 0 ? (
            <div className="notification-empty">Không có yêu cầu nào.</div>
          ) : (
            <ul className="notification-list">
              {MOCK_REQUESTS.map(user => (
                <li key={user.username} className="notification-list-item follow-request-item">
                  <img src={user.avatar} alt={user.username} className="notification-avatar" />
                  <div className="notification-user-info">
                    <span className="notification-username">{user.username}</span>
                    <span className="notification-name">{user.name}</span>
                  </div>
                  <button className="accept-btn">Chấp nhận</button>
                  <button className="decline-btn">Từ chối</button>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
      <div className="notification-section normal">
        <div className="section-title">Tuần này</div>
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <div className="notification-empty">Không có thông báo nào.</div>
        ) : (
          <ul className="notification-list">
            {MOCK_NOTIFICATIONS.map(noti => (
              <li key={noti.id} className="notification-list-item">
                <img src={noti.avatar} alt="avatar" className="notification-avatar" />
                <div className="notification-content">
                  <span>{noti.content}</span>
                  <span className="notification-time">{noti.time}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
