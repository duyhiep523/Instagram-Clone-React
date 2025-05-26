import axios from "axios";
import { BASE_API_URL } from "../config";

// Tạo mới bài viết
// params: userId (string), content (string), privacy (string), files (array of File)
export async function createPost({ userId, content, privacy, files }) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("content", content);
  formData.append("privacy", privacy);
  if (Array.isArray(files)) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  } else if (files) {
    formData.append("files", files);
  }

  const response = await axios.post(
    `${BASE_API_URL}/posts/${userId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (response.data.code !== 201) throw new Error(response.data.message);
  return response.data.data;
}

export async function updatePost({ postId, userId, content, privacy, files }) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  if (content !== undefined && content !== null) {
    formData.append("content", content);
  }
  if (privacy !== undefined && privacy !== null) {
    formData.append("privacy", privacy);
  }
  if (Array.isArray(files) && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  } else if (files && files instanceof File) {
    formData.append("files", files);
  }

  const response = await axios.put(
    `${BASE_API_URL}/posts/${userId}/${postId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", 
      },
    }
  );

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Cập nhật bài viết thất bại!");
  }
  return response.data.data;
}
