import axios from "axios";
import { BASE_API_URL } from "../config";


export async function getFollowersNotFollowedBack(currentUserId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${BASE_API_URL}/follows/followers/not-followed-back`,
    {
      params: { currentUserId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Lấy danh sách thất bại");
  }
  return response.data.data;
}


export async function getFollowersByUserId(userId) { // Đổi tên biến cho rõ ràng
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${BASE_API_URL}/follows/followers`, // Giả định đây là endpoint lấy tất cả người theo dõi
    {
      params: { userId }, // Truyền userId vào params
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Lấy danh sách người theo dõi thất bại");
  }
  return response.data.data;
}