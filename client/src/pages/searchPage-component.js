import React, { useEffect, useState } from "react";
import ProductService from "../services/product-service";
import { useNavigate } from "react-router-dom";
import ProductALL from "../components/productALL-component";
const SearchPage = ({ searchData, setSearchData }) => {
  console.log(searchData);
  const navigate = useNavigate();
  let [productData, setProductData] = useState(null);
  console.log(productData);
  useEffect(() => {
    if (searchData) handelsearch();
  }, [searchData]);

  const handelsearch = async () => {
    await ProductService.search(searchData)
      .then((data) => {
        setProductData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
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
      <ProductALL productData={productData} />
    </div>
  );
};
export default SearchPage;
