import React, { useEffect, useState } from "react";
import ProductService from "../services/product-service";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [productData, setProductData] = useState(null);
  const [name, setName] = useState();
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [iamges, setImages] = useState(null);
  let [selectedImages, setSelectedImages] = useState(null);
  useEffect(() => {
    ProductService.getById(_id)
      .then((data) => {
        setProductData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [_id]);
  useEffect(() => {
    if (productData) {
      setName(productData.foundProduct.name);
      setQuantity(productData.foundProduct.quantity);
      setPrice(productData.foundProduct.price);
      setCategory(productData.foundProduct.category);
      setBrand(productData.foundProduct.brand);
    }
  }, [productData]);

  const handleEdit = () => {
    let urls = selectedImages.map((name) => `/images/${name}`);

    const updateItem = {
      name,
      quantity,
      price,
      category,
      brand,
      imageUrl: urls,
    };

    ProductService.editProduct(_id, updateItem)
      .then(() => {
        window.alert("商品已編輯成功");
        navigate(`/editProductPage`);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map((file) => file.name);
    setSelectedImages(fileNames);
  };
  return (
    <div className="editProduct-Container">
      {productData && (
        <div className="items">
          <div className="item">
            <label>Name</label>
            {productData && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
          </div>
          <div className="item">
            <label>Quantity</label>
            {productData && (
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            )}
          </div>
          <div className="item">
            <label>Price</label>
            {productData && (
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            )}
          </div>
          <div className="item">
            <label>CATEGORY</label>
            {productData && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">{category}</option>
                <option value="TOP">TOP</option>
                <option value="BOTTOM">BOTTOM</option>
                <option value="ACCESSIRES">ACCESSIRES</option>
                <option value="HEADWEAR">HEADWEAR</option>
              </select>
            )}
          </div>
          <div className="item">
            <label>BRAND</label>
            {productData && (
              <input
                type="String"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            )}
          </div>
          <div className="item">
            <label>Pictures</label>
            <input
              multiple
              onChange={handleImageChange}
              type="file"
              name="images"
            />
          </div>

          <button onClick={handleEdit}>Save</button>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
