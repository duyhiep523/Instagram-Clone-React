import axios from 'axios';
import { BASE_API_URL } from '../config';

// Tạo mới bài viết
// params: userId (string), content (string), privacy (string), files (array of File)
export async function createPost({ userId, content, privacy, files }) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('content', content);
  formData.append('privacy', privacy);
  if (Array.isArray(files)) {
    files.forEach(file => {
      formData.append('files', file);
    });
  } else if (files) {
    formData.append('files', files);
  }

  const response = await axios.post(
    `${BASE_API_URL}/posts/${userId}`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  if (response.data.code !== 201) throw new Error(response.data.message);
  return response.data.data;
}
