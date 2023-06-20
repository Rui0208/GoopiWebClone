import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./nav";
import Footer from "./footer";
const Layout = ({
  currentUser,
  setCurrentUser,
  searchData,
  setSearchData,
  showCart,
  setShowCart,
}) => {
  return (
    <>
      <Nav
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        searchData={searchData}
        setSearchData={setSearchData}
        setShowCart={setShowCart}
        showCart={showCart}
      />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
