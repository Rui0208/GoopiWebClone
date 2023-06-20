import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faMagnifyingGlass,
  faTrash,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import CartService from "../services/cart-service";
const Nav = ({
  currentUser,
  setCurrentUser,
  searchData,
  setSearchData,
  showCart,
  setShowCart,
}) => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cartItem, setCartItem] = useState(null);
  const [navList, setNavList] = useState(false);

  const [showInput, setShowInput] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showBrandsList, setShowBrandsList] = useState(false);
  const [keyword, setKeyword] = useState("");

  const getCartItems = () => {
    CartService.getCart()
      .then((data) => {
        setCartItem(data.data.items);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleNavList = () => {
    setNavList(!navList);
  };
  const handleLinkHover = () => {
    setShowInput(true);
  };

  const handleLinkLeave = () => {
    setShowInput(false);
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };
  const handleCategory = () => {
    setShowCategoryList(!showCategoryList);
  };

  const handleBrands = () => {
    setShowBrandsList(!showBrandsList);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchData(keyword);
      setKeyword("");
      navigate("/search");
    }
  };

  useEffect(() => {
    getCartItems();
  }, [cartData]);
  useEffect(() => {
    CartService.getCart()
      .then((data) => {
        setCartData(data.data.items);
        let quantity = cartData.length;
        setCartQuantity(quantity);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [cartData]);

  const handleDelete = (productId) => {
    return () => {
      CartService.productDelete(productId)
        .then(() => {
          alert("商品已刪除");
          getCartItems();
        })
        .catch((e) => {
          console.log(e);
        });
    };
  };
  const cartStyles = {
    transition: "opacity 0.5s ease",
    opacity: showCart ? 1 : 0,
  };
  return (
    <div
      style={{
        borderBottom: "0.5px solid black",
        paddingBottom: "1.5rem",
      }}
    >
      {showCart && (
        <div className="showCart-Container" style={cartStyles}>
          <div className="cartList">
            <p>Shopping Cart</p>
            <div className="cartItem">
              {cartItem &&
                cartItem.map((item) => {
                  return (
                    <div className="item" key={item._id}>
                      <img src={item.product.imageUrl[0]} alt="productImg" />
                      <div className="itemName">{item.product.name}</div>
                      <div className="itemQuantity">{item.quantity}x</div>
                      <div className="itemPrice">NT${item.product.price}</div>
                      <button onClick={handleDelete(item.product._id)}>
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "#a8a7a7" }}
                        />
                      </button>
                    </div>
                  );
                })}
              {cartItem && (
                <div className="checkOut">
                  <button
                    onClick={() => {
                      navigate("/cart");
                      setShowCart(false);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            onClick={() => {
              setShowCart(false);
            }}
            className="shadow"
          ></div>
        </div>
      )}
      <nav>
        <ul className="nav-left">
          <li className="leftitem">
            <span>$ TWD</span>
          </li>
          <li className="leftitem">
            <span>繁體中文</span>
          </li>
        </ul>
        <ul className="navLeft-Mobile">
          <li onClick={handleNavList} className="leftItem">
            <FontAwesomeIcon icon={faBars} style={{ color: "#000000" }} />
          </li>
          <li className="leftItem">
            <FontAwesomeIcon
              onClick={() => {
                setShowInput(!showInput);
              }}
              className="link-style nav-end"
              icon={faMagnifyingGlass}
              style={{ color: "#000000" }}
            />

            {showInput && (
              <div className="showInput-Container">
                <div className="shadow"></div>
                <div className="fixedInput">
                  <input
                    className="showInput"
                    type="text"
                    value={keyword}
                    placeholder="Search products"
                    onChange={handleInputChange}
                    // onMouseLeave={handleLinkLeave}
                    onKeyDown={handleInputKeyDown}
                  />
                </div>
              </div>
            )}
          </li>
        </ul>
        <Link to={"/"} className="link-style nav-start">
          <img className="logo" src="/images/logo.webp" alt="" />
        </Link>

        <ul className="nav-right">
          <li className="rightitem search">
            <FontAwesomeIcon
              onMouseEnter={handleLinkHover}
              className="link-style nav-end"
              icon={faMagnifyingGlass}
              style={{ color: "#000000" }}
            />

            {showInput && (
              <input
                type="text"
                value={keyword}
                placeholder="Search products"
                onChange={handleInputChange}
                onMouseLeave={handleLinkLeave}
                onKeyDown={handleInputKeyDown}
                style={{
                  display: "inline-block",
                  zIndex: "100",
                  position: "absolute",
                  border: "none",
                  borderBottom: "0.75px solid black",
                  width: "8rem",
                  transition: "all 0.5s ease",
                  fontSize: "1.25rem",
                }}
              />
            )}
          </li>
          {currentUser ? (
            <li className="rightitem">
              <Link to={"/profilePage"} className="link-style nav-end">
                <FontAwesomeIcon icon={faUser} style={{ color: "#000000" }} />{" "}
              </Link>
            </li>
          ) : (
            <li className="rightitem">
              <Link to={"/loginPage"} className="link-style nav-end">
                <FontAwesomeIcon icon={faUser} style={{ color: "#000000" }} />{" "}
              </Link>
            </li>
          )}

          <li
            onClick={() => {
              setShowCart(true);
            }}
            className="rightitem cartItem"
          >
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{ color: "#000000" }}
            />
            {/* <Link to={"/cart"} className="link-style nav-end">
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{ color: "#000000" }}
              />
            </Link> */}

            {cartQuantity > 0 && cartData && (
              <p className="cart-item-count">{cartQuantity}</p>
            )}
          </li>
        </ul>
      </nav>
      {navList && (
        <div className="navList-Container">
          <div className="navList">
            <ul className="list">
              <li
                onClick={() => {
                  setNavList(false);
                  navigate("/products/categories/new-arrivals");
                }}
                className="bar"
              >
                NEW ARRIVALS
              </li>
              <li
                onClick={() => {
                  setNavList(false);
                  navigate("/products/categories/category");
                }}
              >
                CATEGORY{" "}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategory();
                  }}
                ></span>
                {showCategoryList && (
                  <ul>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavList(false);
                        navigate("/products/categories/TOP");
                      }}
                    >
                      {" "}
                      TOP
                    </li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavList(false);
                        navigate("/products/categories/BOTTOM");
                      }}
                    >
                      BOTTOM
                    </li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavList(false);
                        navigate("/products/categories/ACCESSORIES");
                      }}
                    >
                      ACCESSORIES
                    </li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavList(false);
                        navigate("/products/categories/HEADWEAR");
                      }}
                    >
                      HEADWEAR
                    </li>
                  </ul>
                )}
              </li>
              <li
                onClick={() => {
                  setNavList(false);
                  navigate("/products/categories/brands");
                }}
              >
                BRANDS
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrands();
                  }}
                ></span>
                {showBrandsList && (
                  <ul>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavList(false);
                        navigate("/products/brands/GOOPIMADE");
                      }}
                    >
                      {" "}
                      GOOPIMADE
                    </li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavList(false);
                        navigate("/products/brands/example1");
                      }}
                    >
                      example1
                    </li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavList(false);
                        navigate("/products/brands/example2");
                      }}
                    >
                      example2
                    </li>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavList(false);
                        navigate("/products/brands/example3");
                      }}
                    >
                      example3
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
          <div className="shadow"> </div>
        </div>
      )}
      <div className="nav-bar">
        <ul>
          <li
            onClick={() => {
              navigate("/products/categories/new-arrivals");
            }}
            className="bar"
          >
            NEW ARRIVALS
          </li>
          <li
            onClick={() => {
              navigate("/products/categories/category");
            }}
            className="drop-down-menu"
          >
            CATEGORY <span className="caret"></span>
            <ul className="contents">
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/products/categories/TOP");
                }}
              >
                {" "}
                TOP
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/products/categories/BOTTOM");
                }}
              >
                BOTTOM
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/products/categories/ACCESSORIES");
                }}
              >
                ACCESSORIES
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/products/categories/HEADWEAR");
                }}
              >
                HEADWEAR
              </li>
            </ul>
          </li>
          <li
            className="drop-down-menu"
            onClick={() => {
              navigate("/products/categories/brands");
            }}
          >
            BRANDS<span className="caret"></span>
            <ul className="contents">
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/products/brands/GOOPIMADE");
                }}
              >
                {" "}
                GOOPIMADE
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/products/brands/example1");
                }}
              >
                example1
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/products/brands/example2");
                }}
              >
                example2
              </li>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/products/brands/example3");
                }}
              >
                example3
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
