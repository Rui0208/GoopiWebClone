import React, { useEffect, useState } from "react";
import ProductService from "../services/product-service";
import { useParams, useNavigate } from "react-router-dom";

const ProductSelf = () => {
  const navigate = useNavigate();
  let [productData, setProductData] = useState(null);
  console.log(productData);
  const { _id } = useParams();

  useEffect(() => {
    ProductService.getById(_id)
      .then((data) => {
        setProductData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [_id]);

  const handleDelete = () => {
    const result = window.confirm("確定刪除商品？");
    if (result) {
      ProductService.delete(_id)
        .then(() => {
          window.alert("商品已刪除");
          navigate("/editproductpage");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return;
    }
  };
  const handleEdit = () => {
    navigate(`/product/edit/${_id}`);
  };

  return (
    <div>
      {productData && productData.foundProduct && (
        <div className="productSelf">
          <div className="ImgAll">
            {productData.foundProduct.imageUrl.map((url, index) => {
              return (
                <div key={index}>
                  <img
                    src={url}
                    alt="圖片"
                    onError={(e) => console.log("图片加载失败", e)}
                  />
                </div>
              );
            })}
          </div>
          <div className="rightItem">
            <p>{productData.foundProduct.name}</p>
            <p>Quantity:{productData.foundProduct.quantity}</p>
            <p>NT${productData.foundProduct.price}</p>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelf;
