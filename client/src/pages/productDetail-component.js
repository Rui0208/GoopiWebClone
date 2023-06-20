import React, { useEffect, useState } from "react";
import ProductService from "../services/product-service";
import { useParams } from "react-router-dom";
import CartService from "../services/cart-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const ProductDetail = ({ showCart, setShowCart }) => {
  const navigate = useNavigate();
  let [productData, setProductData] = useState(null);
  let [quantity, setQuantity] = useState(1);
  let [mainImg, setMainImg] = useState("");
  const { _id } = useParams();
  console.log(productData);
  useEffect(() => {
    ProductService.getById(_id)
      .then((data) => {
        setProductData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  useEffect(() => {
    if (
      productData &&
      productData.foundProduct &&
      productData.foundProduct.imageUrl.length > 0
    ) {
      setMainImg(productData.foundProduct.imageUrl[0]);
    }
  }, [productData]);

  const hadelQuantity = (e) => {
    setQuantity(e.target.value);
  };
  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  const hadelCartAdd = (e) => {
    e.preventDefault();
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
    if (productData && productData.foundProduct) {
      CartService.CartAdd(_id, quantity)
        .then(() => {
          setQuantity(1);
          setShowCart(true);
        })
        .catch((e) => {
          alert(e.response.data);
        });
    }
  };
  const hadelCheckOut = (e) => {
    e.preventDefault();
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
    if (productData && productData.foundProduct) {
      CartService.CartAdd(_id, quantity)
        .then(() => {
          window.alert("前往結帳畫面");
          navigate("/cart");
        })
        .catch((e) => {
          alert(e.response.data);
        });
    }
  };
  return (
    <div>
      {productData && productData.foundProduct && (
        <div className="detailPage">
          <div className="imgShow">
            <div className="mainImg">
              <img src={mainImg} alt="" />
            </div>
            <div className="allImg">
              {productData.foundProduct.imageUrl.map((url, index) => {
                return (
                  <div
                    onClick={() => {
                      setMainImg(url);
                    }}
                    className="imgItem"
                    key={index}
                  >
                    <img src={url} alt="圖片" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rightItem">
            <div className="detailName">{productData.foundProduct.name}</div>
            <div className="detailPrice">
              NT${productData.foundProduct.price}
            </div>

            {productData.foundProduct.quantity !== 0 ? (
              <div className="quantitySet">
                {" "}
                <label htmlFor="quantity">Quantity </label>
                <input
                  type="number"
                  min={1}
                  onChange={hadelQuantity}
                  value={quantity}
                  readOnly
                />
                <div className="control">
                  <div onClick={handleIncrement}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ color: "#f8f8f8" }}
                    />
                  </div>
                  <div onClick={handleDecrement}>
                    <FontAwesomeIcon
                      icon={faMinus}
                      style={{ color: "#f8f8f8" }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="solded">Sold Out</div>
            )}

            {productData.foundProduct.quantity !== 0 && (
              <div className="detailSubmit">
                <button onClick={hadelCartAdd}>ADD TO CART</button>
                <button onClick={hadelCheckOut}>BUY NOW</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
