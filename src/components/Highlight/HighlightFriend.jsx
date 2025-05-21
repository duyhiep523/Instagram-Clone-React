import React from 'react';
import './HighlightFriend.css'; // Import file CSS

const HighlightFriend = () => {
  return (
    <div className="highlight-friend">
      <div className="highlight-friend-icon">
        <img src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482740TZa/anh-mo-ta.png" alt="Bạn bè" />
      </div>
      <div className="highlight-friend-label"><p>Bạn bè</p></div>
    </div>
  );
};

export default HighlightFriend;