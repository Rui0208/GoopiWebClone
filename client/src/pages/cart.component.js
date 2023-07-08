import React, { useEffect, useState } from "react";
import CartService from "../services/cart-service";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
const Cart = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  const [quantityData, setQuantityData] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  let token;
  if (localStorage.getItem("user")) {
    token = JSON.parse(localStorage.getItem("user")).token;
  } else {
    token = "";
  }
  useEffect(() => {
    getCartItems();
  }, []);

  const getCartItems = () => {
    CartService.getCart()
      .then((data) => {
        setCartData(data.data.items);

        const initialQuantityData = data.data.items.map(
          (item) => item.quantity
        );
        setQuantityData(initialQuantityData);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // useEffect(() => {
  //   if (cartData.length == 0) {
  //     navigate("/");
  //   }
  // }, [cartData]);
  const handleIncreaseQuantity = (index) => {
    const updatedQuantityData = [...quantityData];
    updatedQuantityData[index] = parseInt(updatedQuantityData[index]) + 1;
    setQuantityData(updatedQuantityData);

    const inputRef = inputRefs.current[index];
    if (inputRef) {
      inputRef.value = updatedQuantityData[index];
    }

    const productID = cartData[index].product._id;
    const updateItem = { quantity: updatedQuantityData[index] };
    CartService.quantityUpdate(productID, updateItem)
      .then(() => {
        getCartItems();
        alert("已更新商品数量");
      })
      .catch((e) => {
        alert(e.response.data);
        getCartItems();
      });
  };
  const handleDecreaseQuantity = (index) => {
    const updatedQuantityData = [...quantityData];
    if (updatedQuantityData[index] > 1) {
      updatedQuantityData[index] = parseInt(updatedQuantityData[index]) - 1;
      setQuantityData(updatedQuantityData);

      const inputRef = inputRefs.current[index];
      if (inputRef) {
        inputRef.value = updatedQuantityData[index];
      }

      const productID = cartData[index].product._id;
      const updateItem = { quantity: updatedQuantityData[index] };
      CartService.quantityUpdate(productID, updateItem)
        .then(() => {
          getCartItems();
          alert("已更新商品数量");
        })
        .catch((e) => {
          alert(e.response.data);
          getCartItems();
        });
    }
  };
  const handleChangeQuantity = (productID, index) => {
    return (e) => {
      const newQuantity = e.target.value;
      console.log(newQuantity);

      const updatedQuantityData = [...quantityData];
      updatedQuantityData[index] = newQuantity;

      setQuantityData(updatedQuantityData);
      updateItemPrice(index, newQuantity);
      const updateItem = { quantity: newQuantity };

      CartService.quantityUpdate(productID, updateItem)
        .then(() => {
          getCartItems();
        })
        .catch((e) => {
          alert(e.response.data);
          getCartItems();
        });
    };
  };

  const handelCheckout = () => {
    if (token == "") {
      alert("請登入或註冊");
      navigate("/loginpage");
      return;
    }
    CartService.checkOut()
      .then((response) => {
        setSubtotal(0);
        if (response.data) {
          window.alert(response.data + "回到首頁");
          navigate("/");
        }
      })
      .catch((e) => {
        window.alert(e.response.data);
      });
  };

  const handleDelete = (productId) => {
    return () => {
      CartService.productDelete(productId)
        .then(() => {
          getCartItems();
        })
        .catch((e) => {
          console.log(e);
        });
    };
  };

  const updateItemPrice = (index, quantity) => {
    const item = cartData[index];
    const price = item.product.price;
    const totalPrice = price * quantity;

    const updatedCartData = [...cartData];
    updatedCartData[index] = {
      ...item,
      totalPrice: totalPrice,
    };

    setCartData(updatedCartData);
  };
  useEffect(() => {
    let calculatedSubtotal = 0;
    if (cartData) {
      calculatedSubtotal = cartData.reduce((total, item, index) => {
        const itemSubtotal = item.product.price * quantityData[index];
        return total + itemSubtotal;
      }, 0);
    }
    setSubtotal(calculatedSubtotal);
  }, [cartData, quantityData]);
  return (
    <div className="cart-Container">
      <div className="container">
        <div className="cartTitle">
          <p>Shopping Cart({cartData && cartData.length}items)</p>
        </div>
        <div className="cartBar">
          <ul>
            <li className="li1">Product Information</li>
            <li>Price</li>
            <li>QTY</li>
            <li>Subtotal</li>
          </ul>
        </div>
        <div className="cartItem">
          {cartData &&
            cartData.map((item, index) => {
              return (
                <div className="item" key={item.product._id}>
                  <img src={item.product.imageUrl[0]} alt="圖片" />
                  <div className="itemName">{item.product.name}</div>
                  <div className="itemPrice">NT${item.product.price}</div>
                  <div className="itemQuantity">
                    <span
                      className="itemDecrease"
                      onClick={() => handleDecreaseQuantity(index)}
                    >
                      <FontAwesomeIcon
                        icon={faMinus}
                        style={{ color: "#000000" }}
                      />
                    </span>
                    <input
                      type="number"
                      readOnly
                      value={quantityData[index] || ""}
                      onChange={handleChangeQuantity(item.product._id, index)}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                    />
                    <span
                      className="itemIncrease"
                      onClick={() => handleIncreaseQuantity(index)}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        style={{ color: "#000000" }}
                      />
                    </span>
                  </div>
                  <div className="itemSubtotal">
                    NT${item.product.price * quantityData[index]}
                  </div>

                  <button
                    className="itemDelete"
                    onClick={handleDelete(item.product._id)}
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      style={{ color: "#ff7a1b" }}
                    />
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      <div className="summaryContainer">
        <div className="cartTitle">
          <p>Order Summary</p>
        </div>
        <div className="subtotal">
          <p>Item Subtotal:</p>
          <p>NT${subtotal}</p>
        </div>
        <button onClick={handelCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
