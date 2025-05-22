import { BASE_API_URL } from "../config";
import axios from "axios";

/**
 * Thả tim (like) cho một bài viết
 * @param {string} userId - ID của người dùng
 * @param {string} postId - ID của bài viết
 * @returns {Promise<any>} - Kết quả phản hồi từ server
 */
export async function reactToPost(userId, postId) {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(
            `${BASE_API_URL}/reactions/${userId}/${postId}`,
            {}, // body rỗng
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // Kiểm tra mã phản hồi (tùy API backend, có thể là code hoặc status)
        if (response.data.code && response.data.code !== 200 && response.data.code !== 201) {
            throw new Error(response.data.message || "Thả tim thất bại");
        }
        return response.data.data || response.data;
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error("Không thể kết nối tới máy chủ");
    }
}

/**
 * (Nếu cần) Bỏ tim (unlike) một bài viết
 * @param {string} userId 
 * @param {string} postId 
 * @returns {Promise<any>}
 */
export async function unReactToPost(userId, postId) {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(
            `${BASE_API_URL}/reactions/${userId}/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.data.code && response.data.code !== 200 && response.data.code !== 201) {
            throw new Error(response.data.message || "Bỏ tim thất bại");
        }
        return response.data.data || response.data;
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error("Không thể kết nối tới máy chủ");
    }
}


export async function checkUserReaction(userId, postId) {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${BASE_API_URL}/reactions/check/${userId}/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && typeof response.data.data === 'boolean') {
        return response.data.data;
      }
      console.warn("Cấu trúc phản hồi API checkUserReaction không như mong đợi:", response.data);
      return false;
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái cảm xúc:", err);
   
      return false;
    }
  }