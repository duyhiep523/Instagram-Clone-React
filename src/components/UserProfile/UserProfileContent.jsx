import React from "react";
import "./UserProfileContent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { getPostsByUserId } from '../../services/userService';
import SkeletonImage from './SkeletonImage';

// Hiệu ứng skeleton cho ảnh bài viết
const ImageWithSkeleton = ({ src, alt }) => {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: 0 }}>
      {!loaded && (
        <SkeletonImage width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      )}
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: loaded ? 'block' : 'none' }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const UserProfileContent = ({ userId: userIdProp }) => {
  console.log(userIdProp);
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPost, setSelectedPost] = React.useState(null);
  const PostModal = React.lazy(() => import('../../Modal/Post/PostModal'));
  const userId = userIdProp || localStorage.getItem('userId');

  React.useEffect(() => {
    async function fetchPosts() {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await getPostsByUserId(userId);
        setPosts(data || []);
      } catch (e) {
        console.error('Lấy bài viết thất bại', e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [userId]);

  if (loading) return <div>Đang tải bài viết...</div>;

  return (
    <div className="profile-posts">
      {posts.length === 0 && <div>Chưa có bài viết nào.</div>}
      {posts.map((post) => (
        <div
          key={post.postId}
          className="post-item"
          onClick={() => setSelectedPost(post)}
          style={{ cursor: 'pointer' }}
        >
          <ImageWithSkeleton src={post.fileUrls && post.fileUrls[0]} alt={post.content?.slice(0, 20) || 'Bài viết'} />
          <div className="post-overlay">
            <div className="overlay-info">
              <FontAwesomeIcon icon={faHeart} /> {post.likeCount}
            </div>
            <div className="overlay-info">
              <FontAwesomeIcon icon={faComment} /> {post.commentCount}
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