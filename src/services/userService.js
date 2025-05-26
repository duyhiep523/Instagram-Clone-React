import { BASE_API_URL } from "../config";
import axios from "axios";

export async function getUserById(userId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.data.code !== 200) throw new Error(response.data.message);
  return response.data.data;
}

export async function register({ email, username, password, full_name }) {
  try {
    const response = await axios.post(`${BASE_API_URL}/users/register`, {
      email,
      username,
      password,
      full_name,
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
        Authorization: `Bearer ${token}`,
      },
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

export async function updateUserInfo(
  userId,
  { username, email, fullName, bio, gender }
) {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${BASE_API_URL}/users/${userId}`,
    {
      username,
      email,
      fullName,
      bio,
      gender,
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
export async function getPostCountByUserId(userId) {
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
}
export async function getPostDetailById(postId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_API_URL}/posts/detail/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

export async function getFollowingCountByUserId(userId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_API_URL}/follows/following/count`,
      {
        params: { userId }, // Sử dụng 'params' để thêm userId vào query string
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data;
    if (result.code !== 200) {
      throw new Error(
        result.message || "Không thể lấy số lượng người đang theo dõi"
      );
    }
    // Trả về giá trị số lượng trực tiếp từ trường 'data' trong phản hồi API
    return result.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error(
      "Không thể kết nối tới máy chủ hoặc lấy số lượng người đang theo dõi."
    );
  }
}

export async function getFollowersCountByUserId(userId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_API_URL}/follows/followers/count`,
      {
        params: { userId }, // Sử dụng 'params' để thêm userId vào query string
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data;
    if (result.code !== 200) {
      throw new Error(
        result.message || "Không thể lấy số lượng người theo dõi"
      );
    }
    // Trả về giá trị số lượng trực tiếp từ trường 'data' trong phản hồi API
    return result.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error(
      "Không thể kết nối tới máy chủ hoặc lấy số lượng người theo dõi."
    );
  }
}

export async function getRelationshipStatus(currentUserId, targetUserId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_API_URL}/follows/relationship`, {
      params: { currentUserId, targetUserId }, // Truyền cả hai userId vào query params
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data;
    if (result.code !== 200) {
      throw new Error(result.message || "Không thể lấy trạng thái quan hệ");
    }
    // Trả về chuỗi trạng thái: "followed_back", "friend", hoặc "none"
    return result.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error(
      "Không thể kết nối tới máy chủ hoặc lấy trạng thái quan hệ."
    );
  }
}

export async function followUser(followerId, followingId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_API_URL}/follows/${followerId}/follow`,
      { followingId: followingId },
      {
        headers: {
          "Content-Type": "application/json", // Đảm bảo Content-Type là JSON
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );

    const result = response.data;
    if (result.code !== 200 && result.code !== 201) {
      throw new Error(result.message || "Thực hiện theo dõi thất bại.");
    }
    return result.data; // Trả về dữ liệu từ phản hồi (nếu có)
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error(
      "Không thể kết nối tới máy chủ hoặc lỗi khi theo dõi người dùng."
    );
  }
}

export async function unfollowUser(followerId, followingId) {
  try {
    const token = localStorage.getItem("token"); // Lấy token xác thực từ localStorage
    const response = await axios.delete(
      `${BASE_API_URL}/follows/${followerId}/unfollow/${followingId}`, // URL API với cả followerId và followingId trong path
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );

    const result = response.data;
    if (result.code !== 200 && result.code !== 204 && result.code !== 201) {
      // API DELETE thường trả về 200 hoặc 204 cho thành công
      throw new Error(result.message || "Thực hiện hủy theo dõi thất bại.");
    }
    return result.data; // Trả về dữ liệu từ phản hồi (nếu có, thường rỗng với DELETE)
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error(
      "Không thể kết nối tới máy chủ hoặc lỗi khi hủy theo dõi người dùng."
    );
  }
}
