import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../services/product-service";
import ProductALL from "../components/productALL-component";
const Category = ({ setShowCart, showCart }) => {
  const navigate = useNavigate();
  const { category } = useParams();
  let [productData, setProductData] = useState(null);
  console.log(productData);
  useEffect(() => {
    ProductService.getCategory(category)
      .then((data) => {
        setProductData(data.data.foundProduct);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [category]);

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
              navigate("/products");
            }}
          >
            ViewALL /{" "}
          </li>
          <li>CATEGORY / </li>
          <li
            onClick={() => {
              navigate(`/products/categories/${category}`);
            }}
          >
            {" "}
            {category}
          </li>
        </ul>
      </div>
      <div className="pageTitle">{category}</div>
      <ProductALL
        productData={productData}
        setShowCart={setShowCart}
        showCart={showCart}
      />
    </div>
  );
};

export default Category;
