import React from "react";
import Stories from "react-insta-stories";
import "./StorySection.css"; // Đường dẫn đến file CSS của bạn
const StorySection = () => {
  const storiesData = [
    {
      content: () => (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <img
            src="https://cdn.thuonggiaonline.vn/images/482dfd0421db0ab46c65f584701733dc9d94ba57943d49ad47cce99616522a66787fc51bae8e1849c40832d35dac6673fba0f2c2ef384fc8e2625fc06ca03b8afbb39e414ce2bd430f85da797baf343282483a3d85cac1fb103efeb555e8dd7f/cach-trang-diem-sieu-thuc-nhu-karina-aespa-0-1024x1280.jpg"
            alt="story"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="story-header">
            <img src="https://images2.thanhnien.vn/528068263637045248/2024/6/13/anh-2-1-17182895314862065415704.jpg" className="avatar" />
            <div>
              <div className="username">xooos_</div>
              <div className="time">6 giờ</div>
            </div>
          </div>
        </div>
      ),
    },

     {
      content: () => (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <img
            src="https://cdn.thuonggiaonline.vn/images/482dfd0421db0ab46c65f584701733dc9d94ba57943d49ad47cce99616522a66787fc51bae8e1849c40832d35dac6673fba0f2c2ef384fc8e2625fc06ca03b8afbb39e414ce2bd430f85da797baf343282483a3d85cac1fb103efeb555e8dd7f/cach-trang-diem-sieu-thuc-nhu-karina-aespa-0-1024x1280.jpg"
            alt="story"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="story-header">
            <img src="https://images2.thanhnien.vn/528068263637045248/2024/6/13/anh-2-1-17182895314862065415704.jpg" className="avatar" />
            <div>
              <div className="username">xooos_</div>
              <div className="time">6 giờ</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const storyStyles = {
    width: "100%",
    height: "100vh",
    maxWidth: "none",
    maxHeight: "none",
    margin: 0,
  };

  return (
    <div className="story-viewer-container">
      <Stories
        stories={storiesData}
        loop={true}
        keyboardNavigation
        defaultInterval={5000}
        width="100%"
        height="100%"
        loader
        style={storyStyles}
        onStoryEnd={(s, st) => console.log("story ended", s, st)}
        onAllStoriesEnd={(s, st) => console.log("all stories ended", s, st)}
        onStoryStart={(s, st) => console.log("story started", s, st)}
      />
    </div>
  );
};

export default StorySection;
