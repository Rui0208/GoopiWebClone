import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth-service";
const LoginPage = ({ currentUser, setCurrentUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  let [userName, setUserName] = useState("");
  let [account, setAccount] = useState("");
  let [password, setPassword] = useState("");

  let [message, setMessage] = useState("");
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handleAccount = (e) => {
    setAccount(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleSwitchForm = () => {
    setIsLogin(!isLogin);
    setUserName("");
    setAccount("");
    setPassword("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 根據 isLogin 狀態執行登入或註冊的相應邏輯
    if (isLogin) {
      // 登入邏輯
      try {
        let response = await AuthService.login(account, password);
        localStorage.setItem("user", JSON.stringify(response.data));
        window.alert("登入成功。您現在將被導向到個人頁面");
        console.log(setCurrentUser);
        setCurrentUser(AuthService.getCurrentUser());
        setMessage("");
        navigate("/profilePage");
      } catch (e) {
        setMessage(e.response.data);
      }
    } else {
      // 註冊邏輯
      AuthService.register(userName, account, password)
        .then(() => {
          setAccount("");
          setPassword("");
          setMessage("");
          window.alert("註冊成功。您現在將被導向到登入頁面");
          setIsLogin(!isLogin);
        })
        .catch((e) => {
          setMessage(e.response.data);
        });
    }
  };

  return (
    <div className="login-Container">
      <div className="container">
        <div className="controller">
          <button
            onClick={handleSwitchForm}
            disabled={!isLogin}
            style={{
              backgroundColor: "white",
              borderBottom: !isLogin ? "none" : "1px solid #ddd",
              borderRight: !isLogin ? "1px solid #ddd" : "none",
              color: !isLogin ? "#ff7b1a" : "black",
            }}
          >
            註冊會員
          </button>
          <button
            onClick={handleSwitchForm}
            disabled={isLogin}
            style={{
              backgroundColor: "white",
              borderBottom: isLogin ? "none" : "1px solid #ddd",
              borderLeft: isLogin ? "1px solid #ddd" : "none",
              color: isLogin ? "#ff7b1a" : "black",
            }}
          >
            會員登入
          </button>
        </div>

        {isLogin && <p>登入帳號</p>}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            // 登入表單內容
            <div className="loginInput">
              {message && <div className="alert-error">{message}</div>}
              <input
                onChange={handleAccount}
                type="email"
                name="account"
                placeholder="電郵"
                value={account}
              />

              <input
                onChange={handlePassword}
                type="password"
                name="password"
                placeholder="密碼"
                value={password}
              />
            </div>
          ) : (
            // 註冊表單內容
            <div className="registerInput">
              {message && <div className="alert-error">{message}</div>}
              <input
                onChange={handleUserName}
                placeholder="用戶名"
                type="String"
                name="username"
                value={userName}
                required
              />
              <input
                onChange={handleAccount}
                placeholder="電郵"
                type="String"
                name="account"
                value={account}
                required
              />

              <input
                onChange={handlePassword}
                placeholder="密碼"
                type="password"
                name="password"
                value={password}
                required
              />
            </div>
          )}
          <div className="hint">至少6個字元</div>
          <div className="submit">
            <button onClick={handleSubmit} type="submit">
              {isLogin ? "開始購物吧！" : "立即加入！"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
