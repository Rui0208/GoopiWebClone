import React from "react";
const Footer = () => {
  return (
    <div className="footer-Container">
      <div className="footer">
        <ul className="line1">
          <li>
            <a
              target="_blank"
              href="https://www.facebook.com/profile.php?id=100009207715411"
            >
              FACEBOOK
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/rui___0208/" target="_blank">
              INSTAGRAM
            </a>
          </li>
          <li>
            <a href="https://line.me/ti/p/Zk3XtS_LSd" target="_blank">
              LINE@
            </a>
          </li>
          <li>
            <a
              href="mailto:alex02081@icloud.com?subject=Hello&body=Hi"
              target="_blank"
            >
              Email us at alex02081@icloud.com
            </a>
          </li>
        </ul>
        <ul className="line2">
          <li>
            {" "}
            <img src={"/images/logo.webp"} alt="" />
          </li>
          <li>
            {" "}
            <p>Copyright 2023 © Rui</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
