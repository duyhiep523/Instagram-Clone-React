import { BASE_API_URL } from "../config";
import axios from "axios";

/**
 * Tạo mới highlight story cho user
 * @param {string} userId
 * @param {string} storyName
 * @param {File[]} images - Mảng file ảnh hoặc video
 * @returns {Promise<any>}
 */
export async function createHighlightStory(userId, storyName, images) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("storyName", storyName);
  images.forEach(file => formData.append("images", file));

  const response = await axios.post(
    `${BASE_API_URL}/highlight-stories/${userId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.data.code !== 201) {
    throw new Error(response.data.message || "Tạo Highlight Story thất bại");
  }
  return response.data.data;
}


export async function getAllHighlightStories(userId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${BASE_API_URL}/highlight-stories/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Lấy danh sách Highlight Story thất bại");
  }
  return response.data.data;
}



export async function getHighlightStoryDetail(userId, storyId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${BASE_API_URL}/highlight-stories/${userId}/${storyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Lấy chi tiết Highlight Story thất bại");
  }
  return response.data.data;
}