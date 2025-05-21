import React from "react";
import LoginForm from "../../components/LoginForm";
import "./LoginPage.css";


const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-left">
        <img src="/assets/images/instagram-web-lox-image.png" alt="Instagram Screens" />
      </div>
      <div className="login-right">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
