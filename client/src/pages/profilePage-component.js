import React, { useEffect, useState } from "react";
import AuthService from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdBadge, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const _id = currentUser.user._id;
  console.log(currentUser.user.username);
  let [userData, setUserData] = useState("");
  let [account, setAccount] = useState("");
  let [username, setUserName] = useState("");
  let [phoneNumber, setPhoneNumber] = useState("");
  let [lineId, setLineId] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  console.log(phoneNumber);
  console.log(userData);
  useEffect(() => {
    if (userData) {
      setAccount(userData[0].account);
      setUserName(userData[0].username);
      setPhoneNumber(userData[0].phoneNumber);
      setLineId(userData[0].lineId);
    }
  }, [userData]);

  const handelAccount = (e) => {
    setAccount(e.target.value);
  };
  const handelPhone = (e) => {
    setPhoneNumber(e.target.value);
  };
  const handleLineId = (e) => {
    setLineId(e.target.value);
  };
  useEffect(() => {
    AuthService.getUser(_id)
      .then((data) => {
        setUserData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const handleSwitchForm = () => {
    setIsEditingProfile(!isEditingProfile);
  };
  const handleLogout = () => {
    AuthService.logout(); // 清空local storage
    window.alert("登出成功!現在您會被導向到首頁。");
    setCurrentUser(null);
  };
  const handleSubmit = () => {
    const updatedItem = { username, account, phoneNumber, lineId };
    AuthService.editUser(_id, updatedItem)
      .then((data) => {
        alert("更改成功");
      })
      .catch((e) => {
        // console.log(e);
        alert(e.response.data);
      });
  };
  return (
    <div>
      {userData && (
        <div>
          <div className="profile-nav">
            <ul>
              <li>
                <Link
                  onClick={handleLogout}
                  className="link-style nav-start"
                  to="/"
                >
                  Logout
                </Link>
              </li>

              {username == "admin" && (
                <li>
                  <Link
                    to={"/editProductPage"}
                    className="link-style nav-start"
                  >
                    EditProduct
                  </Link>
                </li>
              )}
              {username == "admin" && (
                <li>
                  <Link to={"/post"} className="link-style nav-end">
                    SellProduct
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="profileContainer">
            <div className="container">
              <div className="profile-navbar">
                <button
                  onClick={handleSwitchForm}
                  disabled={!isEditingProfile}
                  style={{
                    backgroundColor: "white",
                    borderBottom: !isEditingProfile
                      ? "none"
                      : "1px solid #a8a7a7",
                    borderRight: !isEditingProfile
                      ? "1px solid #a8a7a7"
                      : "none",
                    color: !isEditingProfile ? "#ff7b1a" : "black",
                  }}
                >
                  Profile
                </button>
                <button
                  onClick={handleSwitchForm}
                  disabled={isEditingProfile}
                  style={{
                    backgroundColor: "white",
                    borderBottom: isEditingProfile
                      ? "none"
                      : "1px solid #a8a7a7",
                    borderLeft: isEditingProfile ? "1px solid #a8a7a7" : "none",
                    color: isEditingProfile ? "#ff7b1a" : "black",
                  }}
                >
                  Orders
                </button>
              </div>
              {isEditingProfile ? (
                <div>orders</div>
              ) : (
                <div className="editProfile">
                  <p>
                    {" "}
                    <span style={{ marginRight: "0.5rem" }}>
                      {" "}
                      <FontAwesomeIcon
                        icon={faIdBadge}
                        style={{
                          "--fa-primary-color": "#ffffff",
                          "--fa-secondary-color": "#e6e6e6",
                        }}
                      />
                    </span>
                    {userData[0].username}
                  </p>

                  <p>
                    <span style={{ marginRight: "0.5rem" }}>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ color: "#e6e6e6" }}
                      />
                    </span>
                    Edit Member Profile
                  </p>
                  <div>
                    {" "}
                    <p>Name</p>
                    <input
                      type="string"
                      value={username}
                      min="3"
                      max="50"
                      onChange={(e) => {
                        setUserName(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <p>Email Address</p>
                    <input
                      type="email"
                      value={account}
                      onChange={handelAccount}
                    />
                  </div>
                  <div>
                    <p>Password</p>
                    <Link to="/editpassword">Set new password</Link>
                  </div>
                  <div>
                    <p>Mobile Number</p>
                    <input
                      type="string"
                      value={phoneNumber}
                      onChange={handelPhone}
                    />
                  </div>
                  <div>
                    {" "}
                    <p>LineId</p>
                    <input
                      type="string"
                      value={lineId}
                      onChange={handleLineId}
                    />
                  </div>
                  <div className="profileSubmit">
                    <button onClick={handleSubmit}>Save changes</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
