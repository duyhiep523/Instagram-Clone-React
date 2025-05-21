import React from "react";
import "./UserProfileContent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons"; // Sử dụng icon trái tim và bình luận
const UserProfileContent = () => {
  const posts = [
    {
      id: 1,
      imageUrl: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-68.jpg",
      likes: 16,
      comments: 244,
    },
    {
      id: 2,
      imageUrl: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-68.jpg",
      likes: 25,
      comments: 100,
    },
    {
      id: 3,
      imageUrl:
        "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/11/tai-hinh-nen-dep-mien-phi.jpg",
      likes: 8,
      comments: 50,
    },
    {
      id: 4,
      imageUrl: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-68.jpg",
      likes: 120,
      comments: 32,
    },
    {
      id: 5,
      imageUrl: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-68.jpg",
      likes: 55,
      comments: 78,
    },
    {
      id: 6,
      imageUrl: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-68.jpg",
      likes: 30,
      comments: 15,
    },
    // Thêm nhiều bài viết hơn với thông tin likes và comments
  ];

  const [selectedPost, setSelectedPost] = React.useState(null);
  const PostModal = React.lazy(() => import('../../Modal/Post/PostModal'));

  return (
    <div className="profile-posts">
      {posts.map((post) => (
        <div
          key={post.id}
          className="post-item"
          onClick={() => setSelectedPost(post)}
          style={{ cursor: 'pointer' }}
        >
          <img src={post.imageUrl} alt={`Bài viết ${post.id}`} />
          <div className="post-overlay">
            <div className="overlay-info">
              <FontAwesomeIcon icon={faHeart} /> {post.likes}
            </div>
            <div className="overlay-info">
              <FontAwesomeIcon icon={faComment} /> {post.comments}
            </div>
          </div>
        </div>
      ))}
      {selectedPost && (
        <React.Suspense fallback={<div>Đang tải...</div>}>
          <PostModal onClose={() => setSelectedPost(null)} post={selectedPost} />
        </React.Suspense>
      )}
    </div>
  );
};

export default UserProfileContent;
