import React, { useEffect, useState } from "react";
import ProductService from "../services/product-service";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faPlus,
  faMinus,
  faXmark,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import CartService from "../services/cart-service";
const ProductALL = ({ productData, setShowCart, showCart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [reversedProductData, setReversedProductData] = useState([]);
  const [showCartItem, setShowCartItem] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [showQuickShop, setShowQuickShop] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImg, setMainImg] = useState("");
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => {
            setCurrentPage(i);
            scrollToTop();
          }}
        >
          {i}
        </li>
      );
    }

    return <ul className="pagination">{pageNumbers}</ul>;
  };
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
    scrollToTop();
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    scrollToTop();
  };

  useEffect(() => {
    if (reversedProductData) {
      const totalPages = Math.ceil(
        reversedProductData.length / productsPerPage
      );
      setTotalPages(totalPages);
    }
  }, [reversedProductData]);
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return reversedProductData.slice(startIndex, endIndex);
  };

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
  const handelCartItemEnter = (productId) => {
    setShowCartItem(!showCartItem);
    setHoveredProductId(productId);
  };
  const handelCartItemLeave = (productId) => {
    setShowCartItem(!showCartItem);
    setHoveredProductId(null);
  };
  useEffect(() => {
    if (productData) {
      setReversedProductData([...productData].reverse());
    }
  }, [productData]);
  const handleProductClick = (productId) => {
    // const url = `/products/${productId}`;
    // window.open(url, "_blank");
    navigate(`/products/${productId}`);
  };
  const handleQuickShop = (productId, e) => {
    e.stopPropagation();
    const selected = productData.find((product) => product._id === productId);
    setSelectedProduct(selected);
    if (selected) {
      setMainImg(selected.imageUrl[0]);
      setSelectedProductId(selected._id);
    }
    setShowQuickShop(true);
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
    if (selectedProduct) {
      CartService.CartAdd(selectedProductId, quantity)
        .then(() => {
          setQuantity(1);
          setShowCart(true);
          setShowQuickShop(false);
        })
        .catch((e) => {
          alert(e.response.data);
        });
    }
  };
  const hadelCheckOut = (e) => {
    console.log(1);
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
    if (selectedProduct) {
      CartService.CartAdd(selectedProductId, quantity)
        .then(() => {
          setShowQuickShop(false);
          navigate("/cart");
        })
        .catch((e) => {
          alert(e.response.data);
        });
    }
  };
  return (
    <div>
      <div className="container">
        {showQuickShop && (
          <div className="quickShop-container">
            <div className="quickShop">
              <button
                onClick={() => {
                  setShowQuickShop(false);
                }}
                className="close"
              >
                <FontAwesomeIcon icon={faXmark} style={{ color: "#a8a7a7" }} />
              </button>
              <div className="imgShow">
                <div className="mainImg">
                  <img src={mainImg} alt="" />
                </div>
                <div className="allImg">
                  {selectedProduct.imageUrl.map((url, index) => {
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
                <div className="items">
                  <p>{selectedProduct.name}</p>
                  <p>NT${selectedProduct.price}</p>
                  <div className="quantitySet">
                    {" "}
                    <div className="quantity" htmlFor="quantity">
                      Quantity{" "}
                    </div>
                    <input
                      type="number"
                      min={1}
                      onChange={hadelQuantity}
                      value={quantity}
                      readOnly
                    />
                    <div className="control">
                      <div className="increment" onClick={handleIncrement}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ color: "#000000" }}
                        />
                      </div>
                      <div onClick={handleDecrement}>
                        <FontAwesomeIcon
                          icon={faMinus}
                          style={{ color: "#000000" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="quickShopSubmit">
                    <button onClick={hadelCartAdd}>ADD TO Cart </button>
                    <button onClick={hadelCheckOut}>BUY NOW</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="shadow"></div>
          </div>
        )}
        <div className=" g-8 row row-cols-xl-4    row-cols-lg-3  row-cols-sm-2  row-cols-1">
          {getCurrentPageProducts().map((product) => {
            return (
              <div
                className="col text-center"
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                style={{ margin: "1.5rem 0rem" }}
              >
                <div
                  className="productImg"
                  onMouseEnter={() => {
                    handelCartItemEnter(product._id);
                  }}
                  onMouseLeave={() => {
                    handelCartItemLeave(product._id);
                  }}
                >
                  {product.quantity == 0 ? (
                    <div className="sold-out">
                      <img
                        src={product.imageUrl[0]}
                        alt="圖片"
                        className="sold-out-img"
                      />
                    </div>
                  ) : (
                    <img
                      src={product.imageUrl[0]}
                      alt="圖片"
                      className="normal-img"
                    />
                  )}
                  {showCartItem &&
                    product.quantity !== 0 &&
                    hoveredProductId == product._id && (
                      <div
                        className="cartAddItem"
                        onClick={(e) => {
                          handleQuickShop(product._id, e);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faBagShopping}
                          style={{ color: "#ff7b1a" }}
                        />
                      </div>
                    )}
                  {product.quantity == 0 && (
                    <div className="soldout-item-content">
                      <div>SOLD</div>
                    </div>
                  )}
                </div>

                <div style={{ height: "7vh" }}>{product.name}</div>
                {/* <div>{product.quantity}</div> */}
                <div>NT${product.price}</div>
                <div
                  className="cartAddItem-Mobile"
                  onClick={(e) => {
                    handleQuickShop(product._id, e);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBagShopping}
                    style={{ color: "#ff7b1a" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="pageControl">
          {currentPage != 1 && (
            <div onClick={goToPreviousPage}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ color: "#a3a3a3" }}
              />
            </div>
          )}
          <div className="pages">{renderPageNumbers()}</div>
          {currentPage !== totalPages && (
            <div onClick={goToNextPage}>
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ color: "#a3a3a3" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductALL;
