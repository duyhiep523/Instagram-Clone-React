import React, { useRef } from "react";
import Stories from "react-insta-stories";
import "./StoryCarousel.css";

const stories = [
  { id: 1, username: "e_seoa", img: "https://i.pravatar.cc/150?img=1" },
  { id: 2, username: "yeniverse", img: "https://i.pravatar.cc/150?img=2" },
  { id: 3, username: "katarinabluu", img: "https://i.pravatar.cc/150?img=3" },
  { id: 4, username: "cas.naf", img: "https://i.pravatar.cc/150?img=4" },
  { id: 5, username: "susan_k__", img: "https://i.pravatar.cc/150?img=5" },
  { id: 6, username: "_aya.lanah_", img: "https://i.pravatar.cc/150?img=6" },
  { id: 7, username: "njz.kangrin", img: "https://i.pravatar.cc/150?img=7" },
  { id: 8, username: "nanie_ntn", img: "https://i.pravatar.cc/150?img=8" },
  { id: 9, username: "extra_1", img: "https://i.pravatar.cc/150?img=9" },
  { id: 10, username: "extra_2", img: "https://i.pravatar.cc/150?img=10" },
];

// Đưa mảng userStories ra ngoài function component
const initialUserStories = [
  {
    username: "e_seoa",
    avatar: "https://i.pravatar.cc/150?img=1",
    stories: [
      { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", type: "image", time: "2 giờ trước" },
      { url: "https://cdn.thuonggiaonline.vn/images/482dfd0421db0ab46c65f584701733dc9d94ba57943d49ad47cce99616522a66787fc51bae8e1849c40832d35dac6673fba0f2c2ef384fc8e2625fc06ca03b8afbb39e414ce2bd430f85da797baf343282483a3d85cac1fb103efeb555e8dd7f/cach-trang-diem-sieu-thuc-nhu-karina-aespa-0-1024x1280.jpg", type: "image", time: "1 giờ trước" }
    ]
  },
  {
    username: "yeniverse",
    avatar: "https://i.pravatar.cc/150?img=2",
    stories: [
      { url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80", type: "image", time: "3 giờ trước" }
    ]
  },
  {
    username: "katarinabluu",
    avatar: "https://i.pravatar.cc/150?img=3",
    stories: [
      { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80", type: "image", time: "4 giờ trước" }
    ]
  },
  {
    username: "cas.naf",
    avatar: "https://i.pravatar.cc/150?img=4",
    stories: [
      { url: "https://images.unsplash.com/photo-1465101178521-c1a9136a936b?auto=format&fit=crop&w=800&q=80", type: "image", time: "5 giờ trước" }
    ]
  },
  {
    username: "susan_k__",
    avatar: "https://i.pravatar.cc/150?img=5",
    stories: [
      { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", type: "image", time: "6 giờ trước" }
    ]
  },
  {
    username: "_aya.lanah_",
    avatar: "https://i.pravatar.cc/150?img=6",
    stories: [
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", type: "image", time: "7 giờ trước" }
    ]
  },
  {
    username: "njz.kangrin",
    avatar: "https://i.pravatar.cc/150?img=7",
    stories: [
      { url: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=800&q=80", type: "image", time: "8 giờ trước" }
    ]
  },
  {
    username: "nanie_ntn",
    avatar: "https://i.pravatar.cc/150?img=8",
    stories: [
      { url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80", type: "image", time: "9 giờ trước" }
    ]
  },
  {
    username: "extra_1",
    avatar: "https://i.pravatar.cc/150?img=9",
    stories: [
      { url: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=800&q=80", type: "image", time: "10 giờ trước" }
    ]
  },
  {
    username: "extra_2",
    avatar: "https://i.pravatar.cc/150?img=10",
    stories: [
      { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80", type: "image", time: "11 giờ trước" }
    ]
  }
];

const StoryCarousel = () => {
  // Giả lập user hiện tại
  const currentUser = {
    username: "duyhiep523",
    avatar: "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/11/top-meme-meo-cuc-dang-yeu-8.png.webp"
  };

  const [showCreateStory, setShowCreateStory] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [userStoriesState, setUserStoriesState] = React.useState(initialUserStories);

  // Khi đăng story mới
  const handlePostStory = () => {
    if (!selectedImage) return;
    const newStory = {
      url: previewUrl,
      type: "image",
      time: "Vừa xong"
    };
    let updated = [...userStoriesState];
    // Nếu user đã có story thì thêm vào đầu
    if (updated[0] && updated[0].username === currentUser.username) {
      updated[0] = {
        ...updated[0],
        stories: [newStory, ...updated[0].stories]
      };
    } else {
      updated = [{
        username: currentUser.username,
        avatar: currentUser.avatar,
        stories: [newStory]
      }, ...updated];
    }
    setUserStoriesState(updated);
    setShowCreateStory(false);
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 200;
    if (direction === "left") {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [showStoryModal, setShowStoryModal] = React.useState(false);
  const [currentUserIdx, setCurrentUserIdx] = React.useState(0);
  const [currentStoryIdx, setCurrentStoryIdx] = React.useState(0);

  // Demo dữ liệu story: Đủ 10 user, mỗi user có ít nhất 1 story
  const userStories = [
    {
      username: "e_seoa",
      avatar: "https://i.pravatar.cc/150?img=1",
      stories: [
        { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", type: "image", time: "2 giờ trước" },
        { url: "https://cdn.thuonggiaonline.vn/images/482dfd0421db0ab46c65f584701733dc9d94ba57943d49ad47cce99616522a66787fc51bae8e1849c40832d35dac6673fba0f2c2ef384fc8e2625fc06ca03b8afbb39e414ce2bd430f85da797baf343282483a3d85cac1fb103efeb555e8dd7f/cach-trang-diem-sieu-thuc-nhu-karina-aespa-0-1024x1280.jpg", type: "image", time: "1 giờ trước" }
      ]
    },
    {
      username: "yeniverse",
      avatar: "https://i.pravatar.cc/150?img=2",
      stories: [
        { url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80", type: "image", time: "3 giờ trước" }
      ]
    },
    {
      username: "katarinabluu",
      avatar: "https://i.pravatar.cc/150?img=3",
      stories: [
        { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80", type: "image", time: "4 giờ trước" }
      ]
    },
    {
      username: "cas.naf",
      avatar: "https://i.pravatar.cc/150?img=4",
      stories: [
        { url: "https://images.unsplash.com/photo-1465101178521-c1a9136a936b?auto=format&fit=crop&w=800&q=80", type: "image", time: "5 giờ trước" }
      ]
    },
    {
      username: "susan_k__",
      avatar: "https://i.pravatar.cc/150?img=5",
      stories: [
        { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", type: "image", time: "6 giờ trước" }
      ]
    },
    {
      username: "_aya.lanah_",
      avatar: "https://i.pravatar.cc/150?img=6",
      stories: [
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", type: "image", time: "7 giờ trước" }
      ]
    },
    {
      username: "njz.kangrin",
      avatar: "https://i.pravatar.cc/150?img=7",
      stories: [
        { url: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=800&q=80", type: "image", time: "8 giờ trước" }
      ]
    },
    {
      username: "nanie_ntn",
      avatar: "https://i.pravatar.cc/150?img=8",
      stories: [
        { url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80", type: "image", time: "9 giờ trước" }
      ]
    },
    {
      username: "extra_1",
      avatar: "https://i.pravatar.cc/150?img=9",
      stories: [
        { url: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=800&q=80", type: "image", time: "10 giờ trước" }
      ]
    },
    {
      username: "extra_2",
      avatar: "https://i.pravatar.cc/150?img=10",
      stories: [
        { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80", type: "image", time: "11 giờ trước" }
      ]
    }
  ];

  const handleOpenStory = (userIdx) => {
    setCurrentUserIdx(userIdx);
    setCurrentStoryIdx(0);
    setShowStoryModal(true);
  };

  // Khi mở story, dùng userStoriesState thay vì userStories


  const handleNextStory = () => {
    const user = userStories[currentUserIdx];
    if (currentStoryIdx < user.stories.length - 1) {
      setCurrentStoryIdx(currentStoryIdx + 1);
    } else if (currentUserIdx < userStories.length - 1) {
      setCurrentUserIdx(currentUserIdx + 1);
      setCurrentStoryIdx(0);
    } else {
      setShowStoryModal(false);
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIdx > 0) {
      setCurrentStoryIdx(currentStoryIdx - 1);
    } else if (currentUserIdx > 0) {
      const prevUser = userStories[currentUserIdx - 1];
      setCurrentUserIdx(currentUserIdx - 1);
      setCurrentStoryIdx(prevUser.stories.length - 1);
    }
  };

  return (
    <>
      <div className="story-carousel-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>
        <div className="story-carousel" ref={scrollRef}>
          {/* Avatar user hiện tại với dấu + */}
          <div
            className="story-avatar-wrapper"
            onClick={() => setShowCreateStory(true)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <div style={{position:'relative',display:'inline-block'}}>
  <span style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 66,
    height: 66,
    background: '#0095f6',
    color: '#fff',
    borderRadius: '50%',
    fontSize: 44,
    fontWeight: 'bold',
    border: '3px solid #fff',
    boxShadow: '0 2px 8px #0005',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background 0.2s',
  }}>+</span>
</div>
            <span className="story-username">Tin của bạn</span>
          </div>
          {/* Các story khác */}
          {userStoriesState.map((user, idx) => (
            <div
              key={user.username}
              className="story-avatar-wrapper"
              onClick={() => handleOpenStory(idx)}
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="story-avatar"
              />
              <span className="story-username">{user.username}</span>
            </div>
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
      {/* Modal tạo story mới */}
      {showCreateStory && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.88)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowCreateStory(false)}>
          <div style={{ background: '#23272f', borderRadius: 18, padding: '32px 28px', minWidth: 350, minHeight: 320, position: 'relative', boxShadow: '0 8px 32px #000a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCreateStory(false)} style={{position:'absolute',top:12,right:18,background:'none',border:'none',color:'#fff',fontSize:28,cursor:'pointer',zIndex:2}}>&times;</button>
            <h3 style={{ marginBottom: 18, fontWeight: 600, fontSize: 22, letterSpacing: 0.5 }}>Tạo story mới</h3>
            <label style={{
              display: 'inline-block',
              padding: '14px 26px',
              background: '#212a35',
              color: '#fff',
              borderRadius: 8,
              cursor: 'pointer',
              marginBottom: 18,
              border: '1.5px solid #444',
              fontSize: 16,
              fontWeight: 500
            }}>
              Chọn ảnh
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
            {previewUrl && (
              <div style={{ marginTop: 0, marginBottom: 18 }}>
                <img src={previewUrl} alt="preview" style={{ maxWidth: 250, maxHeight: 250, borderRadius: 10, boxShadow: '0 2px 12px #0005' }} />
              </div>
            )}
            <div style={{ marginTop: 8, display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}>
              <button onClick={() => setShowCreateStory(false)} style={{ padding: '10px 28px', borderRadius: 7, background: '#363d4a', color: '#fff', border: 'none', fontWeight: 500, fontSize: 15 }}>Hủy</button>
              <button
                onClick={handlePostStory}
                style={{ padding: '10px 28px', borderRadius: 7, background: selectedImage ? '#0095f6' : '#444', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, opacity: selectedImage ? 1 : 0.6, cursor: selectedImage ? 'pointer' : 'not-allowed' }}
                disabled={!selectedImage}
              >Đăng story</button>
            </div>
          </div>
        </div>
      )}
      {showStoryModal && userStories[currentUserIdx] && Array.isArray(userStories[currentUserIdx].stories) && userStories[currentUserIdx].stories.length > 0 && (
        <div
          className="story-modal-overlay"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowStoryModal(false)}
        >
          {/* Nút chuyển user story trái/phải ra ngoài story-modal-content */}
          {currentUserIdx > 0 && (
            <button
              onClick={e => {
                e.stopPropagation();
                setCurrentUserIdx(currentUserIdx - 1);
                setCurrentStoryIdx(0);
              }}
              style={{
                position: 'absolute',
                left: 40,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 54,
                height: 54,
                fontSize: 32,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px #0005',
              }}
              aria-label="Previous user"
            >
              &#8249;
            </button>
          )}
          {currentUserIdx < userStories.length - 1 && (
            <button
              onClick={e => {
                e.stopPropagation();
                setCurrentUserIdx(currentUserIdx + 1);
                setCurrentStoryIdx(0);
              }}
              style={{
                position: 'absolute',
                right: 40,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 54,
                height: 54,
                fontSize: 32,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px #0005',
              }}
              aria-label="Next user"
            >
              &#8250;
            </button>
          )}
          <div
            className="story-modal-content"
            style={{ position: 'relative', width: 400, height: 700, background: '#000', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={e => {
                e.stopPropagation();
                setShowStoryModal(false);
              }}
              style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', zIndex: 10 }}
            >×</button>
            {/* Sử dụng react-insta-stories */}
            <Stories
              stories={userStories[currentUserIdx].stories.map(story => ({
                url: story.url,
                type: story.type,
                header: {
                  heading: userStories[currentUserIdx].username,
                  profileImage: userStories[currentUserIdx].avatar,
                  subheading: story.time
                }
              }))}
              defaultInterval={5000}
              width={400}
              height={700}
              onAllStoriesEnd={() => {
                // Để tránh lỗi setState khi render, dùng setTimeout
                setTimeout(() => {
                  if (currentUserIdx < userStories.length - 1) {
                    setCurrentUserIdx(currentUserIdx + 1);
                    setCurrentStoryIdx(0);
                  } else {
                    setShowStoryModal(false);
                  }
                }, 0);
              }}
              onStoryEnd={(s, st) => {
                // Không cần xử lý vì Stories sẽ tự chuyển story tiếp theo
              }}
              onStoryStart={(idx, st) => setCurrentStoryIdx(idx)}
              keyboardNavigation
              loop={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StoryCarousel;
