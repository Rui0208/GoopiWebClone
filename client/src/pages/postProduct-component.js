import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/product-service";
const PostProduct = () => {
  const navigate = useNavigate();
  let [name, setname] = useState("");
  let [quantity, setQuantity] = useState("");
  let [price, setPrice] = useState("");
  let [category, setCategory] = useState("");
  let [brand, setBrand] = useState("");
  console.log(category);
  let [selectedImages, setSelectedImages] = useState(null);
  let [message, setMessage] = useState("");
  const handleName = (e) => {
    setname(e.target.value);
  };
  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
  };
  const handleBrand = (e) => {
    setBrand(e.target.value);
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map((file) => file.name);
    setSelectedImages(fileNames);
  };

  const handlePostProduct = (e) => {
    e.preventDefault();
    const productData = {
      name,
      quantity,
      price,
      category,
      brand,
      imageUrl: selectedImages,
    };
    console.log(productData);
    ProductService.post(productData)
      .then(() => {
        window.alert("新增商品成功，回到個人頁面");
        navigate("/editProductPage");
      })
      .catch((e) => {
        console.log(e);
        setMessage(e.response.data);
      });
  };

  return (
    <div className="postProduct-Container">
      <div className="container">
        <form>
          <p>POST PRODUCT</p>
          {message && <div className="alert-error">{message}</div>}
          <label htmlFor="name">NAME</label>
          <input
            onChange={handleName}
            type="String"
            name="name"
            min="3"
            max="50"
            required
          />
          <label htmlFor="quantity">QUANTITY</label>
          <input
            onChange={handleQuantity}
            type="number"
            name="quantity"
            min="0"
            required
          />
          <label htmlFor="price">PRICE</label>
          <input
            onChange={handlePrice}
            type="number"
            name="price"
            min="0"
            required
          />
          <label htmlFor="category">CATEGORY</label>
          <select
            onChange={handleCategory}
            type="String"
            name="category"
            required
          >
            <option value=""></option>
            <option value="TOP">TOP</option>
            <option value="BOTTOM">BOTTOM</option>
            <option value="ACCESSORIES">ACCESSORIES</option>
            <option value="HEADWEAR">HEADWEAR</option>
          </select>
          <label htmlFor="category">BRAND</label>
          <input onChange={handleBrand} type="String" name="brand" required />
          <label htmlFor="images">IMAGES</label>
          <input
            multiple
            onChange={handleImageChange}
            type="file"
            name="images"
            required
          />
          <button onClick={handlePostProduct}>新增商品</button>
        </form>
      </div>
    </div>
  );
};

export default PostProduct;
