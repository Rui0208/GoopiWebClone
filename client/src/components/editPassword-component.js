import React, { useState } from "react";
import AuthService from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
const EditPassword = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const userId = currentUser.user._id;
  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("新密碼和確認密碼不一致");
      return;
    }

    const updatedItem = {
      currentPassword,
      newPassword,
    };

    AuthService.editPassword(userId, updatedItem)
      .then((response) => {
        logOut();
        setSuccessMessage("密碼已成功更新");
        setErrorMessage(null);
        navigate("/loginPage");
      })
      .catch((error) => {
        setErrorMessage("密碼更新失敗");
        setSuccessMessage(null);
      });
  };

  const logOut = () => {
    AuthService.logout(); // 清空local storage
    window.alert("密碼已更新，請重新登入！");
    setCurrentUser(null);
  };

  return (
    <div className="editContainer">
      <div className="container">
        <form className="editPassWord">
          <p>EDIT PASSWORD</p>
          <div>
            <span>
              <FontAwesomeIcon icon={faKey} style={{ color: "#0d0d0d" }} />
            </span>
            <input
              type="password"
              value={currentPassword}
              placeholder="Current password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <span>
              <FontAwesomeIcon icon={faKey} style={{ color: "#0d0d0d" }} />
            </span>
            <input
              type="password"
              value={newPassword}
              placeholder="New password(6 characters minium)"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <span>
              <FontAwesomeIcon icon={faKey} style={{ color: "#0d0d0d" }} />
            </span>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Comfirm new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <button onClick={handleFormSubmit}>Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditPassword;
