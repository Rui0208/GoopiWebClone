import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./pages/homepage-component";

import EditProductPage from "./pages/editProductPage-component";
import "./styles/style.css";
import AuthService from "./services/auth-service";
import PostProduct from "./pages/postProduct-component";
import ProductSelf from "./components/productSelf-component";
import ProductDetail from "./pages/productDetail-component";
import LoginPage from "./pages/loginpage-components";
import EditProduct from "./components/editProduct-component";
import Cart from "./pages/cart.component";
import ProfilePage from "./pages/profilePage-component";
import EditPassword from "./components/editPassword-component";
import SearchPage from "./pages/searchPage-component";
import Category from "./pages/category-component";
import CategoryNew from "./pages/category-new-component";
import Brands from "./pages/brands-component";
import Products from "./pages/products-components";
import CategoryBrands from "./pages/categories-brands-component";
import Categories from "./pages/categories-component";
function App() {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [searchData, setSearchData] = useState();
  const [showCart, setShowCart] = useState(false);
  // console.log(currentUser);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              searchData={searchData}
              setSearchData={setSearchData}
              setShowCart={setShowCart}
              showCart={showCart}
            />
          }
        >
          <Route
            index
            element={<Homepage setShowCart={setShowCart} showCart={showCart} />}
          ></Route>
          <Route
            path="/editProductPage"
            element={
              <EditProductPage
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>

          <Route path="post" element={<PostProduct />}></Route>
          <Route
            path="profilePage"
            element={
              <ProfilePage
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route path="products" element={<Products />}></Route>
          <Route path="product/:_id" element={<ProductSelf />}></Route>
          <Route path="product/edit/:_id" element={<EditProduct />}></Route>
          <Route
            path="products/:_id"
            element={<ProductDetail setShowCart={setShowCart} />}
          ></Route>
          <Route
            path="products/categories/:category"
            element={<Category setShowCart={setShowCart} showCart={showCart} />}
          ></Route>
          <Route
            path="products/categories/category"
            element={
              <Categories setShowCart={setShowCart} showCart={showCart} />
            }
          ></Route>
          <Route
            path="products/categories/new-arrivals"
            element={
              <CategoryNew setShowCart={setShowCart} showCart={showCart} />
            }
          ></Route>
          <Route
            path="products/categories/brands"
            element={
              <CategoryBrands setShowCart={setShowCart} showCart={showCart} />
            }
          ></Route>
          <Route
            path="products/brands/:brand"
            element={<Brands setShowCart={setShowCart} showCart={showCart} />}
          ></Route>
          <Route
            path="search"
            element={
              <SearchPage
                searchData={searchData}
                setSearchData={setSearchData}
                setShowCart={setShowCart}
                showCart={showCart}
              />
            }
          ></Route>
          <Route path="cart" element={<Cart />}></Route>
          <Route
            path="editpassword"
            element={
              <EditPassword
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
          <Route
            path="loginpage"
            element={
              <LoginPage
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
