import axios from 'axios';

export async function getCommentsByPostId(postId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:8080/api/v1/post-comments/post/${postId}`,
    { headers: { Authorization: `Bearer ${token}` } });
  if (response.data.code !== 200) throw new Error(response.data.message);
  return response.data.data;
}

/**
 * Gửi bình luận mới lên bài viết
 * @param {string} postId - ID bài viết
 * @param {string} content - Nội dung bình luận
 * @param {string} [parentId] - Nếu là trả lời, truyền id comment cha
 * @returns {Promise<any>} - Kết quả từ server
 */
export async function addComment({ userId, postId, content, parentCommentId }) {
  const token = localStorage.getItem("token");
  const body = { content };
  if (parentCommentId) body.parentCommentId = parentCommentId;
  const response = await axios.post(
    `http://localhost:8080/api/v1/post-comments/${userId}/${postId}`,
    body,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (response.data.code !== 201 && response.data.code !== 200) throw new Error(response.data.message);
  return response.data.data;
}
