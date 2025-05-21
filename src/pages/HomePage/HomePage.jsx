import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import InstagramPost from "../../components/Post/Post";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import "./HomePage.css";
import StoryCarousel from "../../components/StoryCarousel/StoryCarousel";

const HomePage = () => {
  return (

    <div className="app-container-homepage">
      {/* Sidebar cố định bên trái */}
      <div className="main-left-homepage">
        <Sidebar />
      </div>

      <div className="main-content-homepage">
        <div className="main-content-homepage-container">
          <div className="main-post-homepage">
            <div className="story-carousel">
              <StoryCarousel />
            </div>
            <div className="main-post-section">
           
              <InstagramPost />
              <InstagramPost />
              <InstagramPost />
              <InstagramPost />
            </div>
          </div>
          <div className="main-right-homepage">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
