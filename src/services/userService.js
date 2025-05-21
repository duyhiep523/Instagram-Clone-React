import { BASE_API_URL } from "../config";
import axios from "axios";

export async function getUserById(userId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.data.code !== 200) throw new Error(response.data.message);
  return response.data.data;
}



export async function register({ email, username, password, full_name }) {
  try {
    const response = await axios.post(`${BASE_API_URL}/users/register`, {
      email, username, password, full_name
    });
    const result = response.data;
    if (result.code !== 200 && result.code !== 201) {
      throw new Error(result.message || "Đăng ký thất bại");
    }
    return result.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Không thể kết nối tới máy chủ");
  }
}

/**
 * Lấy thông tin người dùng theo username
 * @param {string} username
 * @returns {Promise<any>} Thông tin user hoặc lỗi
 */
export async function getUserByUsername(username) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_API_URL}/users/by-username`, {
      params: { username },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log(response);

    const result = response.data;
    if (result.code !== 200) {
      throw new Error(result.message || "Không tìm thấy người dùng");
    }
    return result.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Không thể kết nối tới máy chủ");
  }



}

export async function updateUserInfo(userId, { username, email, fullName, bio, gender }) {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${BASE_API_URL}/users/${userId}`,
    {
      username,
      email,
      fullName,
      bio,
      gender
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function updateUserAvatar(userId, file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${BASE_API_URL}/users/${userId}/avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
} export async function getPostCountByUserId(userId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_API_URL}/posts/count/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
}

export async function getPostsByUserId(userId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_API_URL}/posts/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}export async function getPostDetailById(postId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_API_URL}/posts/detail/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}