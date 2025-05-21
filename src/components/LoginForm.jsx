import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginService } from "../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginService({ username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      toast.success("Đăng nhập thành công!", {
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
      setTimeout(() => navigate("/home"), 1600);
    } catch (err) {
      toast.error(err.message || "Đăng nhập thất bại", {
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
      setLoading(false);
    }
  };


  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h1 className="logo">Instagram</h1>
      <input
        type="text"
        placeholder="Số điện thoại, tên người dùng hoặc email"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className="login-btn" type="submit" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      
      <div className="separator">HOẶC</div>
      <button className="fb-login-lg" type="button"><p>Đăng nhập bằng facebook</p></button>
      <a href="#" className="forgot-password">Quên mật khẩu?</a>
      <div className="signup-prompt">
        Bạn chưa có tài khoản ư? <Link to="/register" className="register-link">Đăng ký</Link>
      </div>
    </form>
  );
};

export default LoginForm;
