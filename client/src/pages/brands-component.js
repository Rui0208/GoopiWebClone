import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../services/product-service";
import ProductALL from "../components/productALL-component";
const Brands = ({ setShowCart, showCart }) => {
  const navigate = useNavigate();
  const { brand } = useParams();
  let [productData, setProductData] = useState(null);
  console.log(showCart);
  useEffect(() => {
    ProductService.getBrand(brand)
      .then((data) => {
        setProductData(data.data.foundProduct);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [brand]);
  const handleProductClick = (productId) => {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    if (token == "") {
      alert("請登入或註冊");
      navigate("/loginpage");
      return;
    }
    navigate(`/products/${productId}`);
  };
  useEffect(() => {
    if (productData) {
      const soldOutElements = document.querySelectorAll(".productImg");
      soldOutElements.forEach((product) => {
        if (product.parentElement.children[2].innerText === "0") {
          console.log(product.children);
          product.children[1].style.display = "block";
          product.classList.add("sold-out");
        }
      });
    }
  }, [productData]);
  return (
    <div>
      <div className="page-bar">
        <ul className="pages">
          <li
            onClick={() => {
              navigate("/");
            }}
          >
            HOME /{" "}
          </li>
          <li
            onClick={() => {
              navigate("/products/categories/brands");
            }}
          >
            {" "}
            BRANDS /
          </li>
          <li
            onClick={() => {
              navigate(`/products/brands/${brand}`);
            }}
          >
            {"  "}
            {brand}
          </li>
        </ul>
      </div>
      <div className="pageTitle">{brand}</div>
      <ProductALL
        productData={productData}
        setShowCart={setShowCart}
        showCart={showCart}
      />
    </div>
  );
};

export default Brands;
