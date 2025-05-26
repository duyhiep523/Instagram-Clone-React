import React, { useEffect, useState } from "react";
import Stories from "react-insta-stories";
import "./StorySection.css";
import { getHighlightStoryDetail } from "../../services/highlightServices";
import { toast } from "react-toastify";

const StorySection = ({ userId, storyId }) => {
   console.log("StorySection mounted");
  
  const [storiesData, setStoriesData] = useState([null]);

  useEffect(() => {
   
    
    async function fetchDetail() {
      try {
        const data = await getHighlightStoryDetail(userId, storyId);
        if (
          data &&
          Array.isArray(data.imageUrls) &&
          data.imageUrls.length > 0
        ) {
          const storiesArr = data.imageUrls
            .filter((url) => typeof url === "string" && url.trim() !== "")
            .map((url) => ({
              content: () => (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <img
                    src={url}
                    alt="story"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div className="story-header">
                    <img src={data.avatarUrl} className="avatar" alt="avatar" />
                    <div>
                      <div className="username">{data.username}</div>
                      <div className="time">
                        {/* Thời gian có thể format ở đây */}
                      </div>
                    </div>
                  </div>
                </div>
              ),
            }))
            .filter((story) => typeof story.content === "function"); // Đảm bảo content là function

          setStoriesData(storiesArr.length > 0 ? storiesArr : []);
        } else {
          setStoriesData([]);
        }
      } catch (err) {
        toast.error("Không thể tải chi tiết highlight: " + err.message);
        setStoriesData([]);
      }
    }
    if (userId && storyId) fetchDetail();
    else setStoriesData([]);
  }, [userId, storyId]);

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
        loop
        keyboardNavigation
        defaultInterval={5000}
        width="100%"
        height="100%"
        loader
        style={storyStyles}
      />
    </div>
  );
};

export default StorySection;
