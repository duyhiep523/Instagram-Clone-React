import React, { useState } from "react";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import { register as registerService } from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerService({ email, password, full_name: fullName, username });
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.", { autoClose: 1800 });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message || "Đăng ký thất bại", { autoClose: 2200 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="logo">Instagram</h1>
        <p className="desc">Đăng ký để xem ảnh và video từ bạn bè.</p>

        <button className="fb-login">Đăng nhập bằng Facebook</button>

        <div className="divider">
          <span>HOẶC</span>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          <input type="text" placeholder="Số di động hoặc email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="text" placeholder="Tên đầy đủ" value={fullName} onChange={e => setFullName(e.target.value)} required />
          <input type="text" placeholder="Tên người dùng" value={username} onChange={e => setUsername(e.target.value)} required />
          <p className="info">
            Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên
            hệ của bạn lên Instagram. <a href="#">Tìm hiểu thêm</a>
          </p>
          <p className="terms">
            Bằng cách đăng ký, bạn đồng ý với <a href="#">Điều khoản</a>,{" "}
            <a href="#">Chính sách quyền riêng tư</a> và{" "}
            <a href="#">Chính sách cookie</a> của chúng tôi.
          </p>
          <button className="signup-btn" type="submit" disabled={loading}>{loading ? "Đang đăng ký..." : "Đăng ký"}</button>
        </form>
        <ToastContainer position="top-center" />
      </div>

      <div className="login-redirect">
        <p>
          Bạn có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>

      <p className="download">Tải ứng dụng.</p>
    </div>
  );
}

export default RegisterPage;
