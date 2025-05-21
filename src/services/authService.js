
import { BASE_API_URL } from "../config";
import axios from "axios";

import { getUserByUsername } from "./userService";

export async function login({ username, password }) {
  try {
    const response = await axios.post(`${BASE_API_URL}/auth/login`, { username, password });
    const result = response.data;
    if (result.code !== 200) {
      throw new Error(result.message || "Đăng nhập thất bại");
    }
  
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("username", result.data.username);

    const userInfo = await getUserByUsername(result.data.username);
    if (userInfo && userInfo.userId) {
      localStorage.setItem("userId", userInfo.userId);
    }
    return result.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Không thể kết nối tới máy chủ");
  }
}


export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}
