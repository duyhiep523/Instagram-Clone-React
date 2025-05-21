import React, { useState } from "react";
import "./EditProfile.css";
import { updateUserAvatar, updateUserInfo } from "../../services/userService";

import { useEffect } from "react";
import { getUserByUsername } from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProfile() {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (!username) return;
      setLoading(true);
      try {
        const user = await getUserByUsername(username);
        setFullName(user.fullName || "");
        setBio(user.bio || "");
        let genderValue = user.gender;
        if (!genderValue || !["MALE", "FEMALE", "OTHER"].includes(genderValue)) genderValue = "OTHER";
        setGender(genderValue);
        setEmail(user.email || "");
        setAvatar(user.profilePictureUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydHtCWIUJ8LGhvFh33HYzuv4tmVCQVprCNg&s");
      } catch (e) {
        // Có thể báo lỗi nếu cần
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [username]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      setAvatarFile(file);
    }
  };

  const handleSave = async () => {
    try {
      // Cập nhật thông tin user
      if (userId && username) {
        await updateUserInfo(userId, {
          username,
          email,
          fullName,
          bio,
          gender
        });
      }
      // Cập nhật avatar nếu có chọn ảnh mới
      if (avatarFile && userId) {
        await updateUserAvatar(userId, avatarFile);
      }
      toast.success("Cập nhật thông tin thành công!", {
        autoClose: 1500,

        style: {
          background: '#22c55e',
          color: '#fff',
          fontWeight: 600,
          border: '2px solid #22c55e',
          boxShadow: '0 2px 12px rgba(18, 243, 100, 0.18)'
        },
        icon: <span style={{ color: '#22c55e', fontSize: 22 }}>✔</span>
      });
     
    } catch (err) {
      toast.error("Cập nhật thông tin thất bại!", {
        autoClose: 2000,

        style: {
          background: '#ff4d4f',
          color: '#fff',
          fontWeight: 600,
          border: '2px solid #ff4d4f',
          boxShadow: '0 2px 12px rgba(255,77,79,0.18)'
        },
        icon: <span style={{ color: '#ff4d4f', fontSize: 22 }}>✖</span>
      });
    }
  };



  return (
    <div className="edit-profile-container">
      <h2>Chỉnh sửa trang cá nhân</h2>

      <div className="profile-section">
        <img src={avatar} alt="Avatar" className="avatar-edit" />
        <div className="profile-info">
          <div>
            <p className="username">{username}</p>
            <p className="fullname">{fullName}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <label htmlFor="avatar-upload" className="change-avatar-btn" style={{ marginBottom: 8 }}>
              Đổi ảnh
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />
            <button
              style={{ marginTop: 0, padding: '4px 12px', background: '#0095f6', color: '#fff', border: 'none', borderRadius: 4, cursor: avatarUploading ? 'not-allowed' : 'pointer', opacity: avatarUploading ? 0.7 : 1 }}
              disabled={avatarUploading}
              onClick={async () => {
                if (!avatarFile || !userId) {
                  toast.error("Vui lòng chọn ảnh mới!", {
                    autoClose: 2000,

                    style: {
                      background: '#ff4d4f',
                      color: '#fff',
                      fontWeight: 600,
                      border: '2px solid #ff4d4f',
                      boxShadow: '0 2px 12px rgba(255,77,79,0.18)'
                    },
                    icon: <span style={{ color: '#ff4d4f', fontSize: 22 }}>✖</span>
                  });
                  return;
                }
                setAvatarUploading(true);
                try {
                  await updateUserAvatar(userId, avatarFile);
                  toast.success("Cập nhật ảnh đại diện thành công!", {
                    autoClose: 1500,

                    style: {
                      background: '#22c55e',
                      color: '#fff',
                      fontWeight: 600,
                      border: '2px solid #22c55e',
                      boxShadow: '0 2px 12px rgba(34,197,94,0.18)'
                    },
                    icon: <span style={{ color: '#22c55e', fontSize: 22 }}>✔</span>
                  });
                } catch (error) {
                  console.error("Lỗi cập nhật avatar:", error);
                  toast.error("Cập nhật ảnh đại diện thất bại!", {
                    autoClose: 2000,

                    style: {
                      background: '#ff4d4f',
                      color: '#fff',
                      fontWeight: 600,
                      border: '2px solid #ff4d4f',
                      boxShadow: '0 2px 12px rgba(255,77,79,0.18)'
                    },
                    icon: <span style={{ color: '#ff4d4f', fontSize: 22 }}>✖</span>
                  });
                } finally {
                  setAvatarUploading(false);
                }
              }}
            >
              {avatarUploading ? "Đang lưu..." : "Lưu ảnh đại diện"}
            </button>

          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Tiểu sử</label>
        <textarea
          value={bio}
          maxLength={150}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <div className="char-count">{bio.length} / 150</div>
      </div>

      <div className="form-group">
        <label htmlFor="email" style={{ color: '#fff', fontWeight: 500, marginBottom: 6, display: 'block' }}>Email</label>
        <input
          id="email"
          className="edit-profile-input"
          type="email"
          value={email}
          placeholder="Nhập email của bạn"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            backgroundColor: '#181818',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            marginTop: 2
          }}
        />
      </div>
      <div className="form-group">
        <label>Họ và tên</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Giới tính</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="MALE">Nam</option>
          <option value="FEMALE">Nữ</option>
          <option value="OTHER">Khác</option>
        </select>
        <p className="note">
          Thông tin này sẽ không xuất hiện trên trang cá nhân công khai của bạn.
        </p>
      </div>
      <div className="save-button-container">
        <button
          onClick={handleSave}
          className="save-button"
        >
          Lưu
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
