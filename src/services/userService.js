import { BASE_API_URL } from "../config";
import axios from "axios";

/**
 * Đăng ký tài khoản mới
 * @param {Object} param0 {email, username, password, full_name}
 * @returns {Promise<any>} Thông tin user hoặc lỗi
 */
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
/**
 * Cập nhật avatar người dùng
 * @param {string} userId
 * @param {File} file
 * @returns {Promise<any>}
 */
/**
 * Cập nhật thông tin người dùng (fullName, bio, gender)
 * @param {string} userId
 * @param {{fullName: string, bio: string, gender: string}} data
 * @returns {Promise<any>}
 */
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
}