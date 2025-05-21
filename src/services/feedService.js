import axios from 'axios';
import { BASE_API_URL } from '../config';

export async function getFeedByUserId(userId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_API_URL}/posts/feed/${userId}`,
    { headers: { Authorization: `Bearer ${token}` } });
//   console.log("đây là data feed:", response.data); 
  if (response.data.code !== 200) throw new Error(response.data.message);
  return response.data.data;
}