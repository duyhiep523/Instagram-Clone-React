import axios from 'axios';

export async function getCommentsByPostId(postId) {
  const token = localStorage.getItem("token");

  const response = await axios.get(`http://localhost:8080/api/v1/post-comments/post/${postId}`,
    { headers: { Authorization: `Bearer ${token}` } });
  console.log("đây là data bình luận: ", response.data);
  if (response.data.code !== 200) throw new Error(response.data.message);
  return response.data.data;
}
