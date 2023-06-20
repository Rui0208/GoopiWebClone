import React, { useEffect, useState } from "react";
import ProductService from "../services/product-service";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Profile = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [productData, setProductData] = useState(null);
  const [reversedProductData, setReversedProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);
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
  useEffect(() => {
    if (productData) {
      setReversedProductData([...productData].reverse());
    }
  }, [productData]);
  useEffect(() => {
    ProductService.get()
      .then((data) => {
        if (Array.isArray(data.data)) {
          setProductData(data.data);
        } else {
          console.log("找不到商品");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleProductClick = (productId) => {
    const url = `/product/${productId}`;
    window.open(url, "_blank");
  };

  const handleDelete = () => {
    const result = window.confirm("確定刪除帳號？");
    if (result) {
      AuthService.deleteUser(currentUser.user._id)
        .then((response) => {
          alert(response.data.message);
          setCurrentUser(null);
          navigate("/");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return;
    }
  };
  return (
    <div>
      {!currentUser && <div>請先登入</div>}
      {currentUser && (
        <div>
          <div className="admin">
            <div className="adminName">{currentUser.user.username} </div>
            {productData && <p>刊登商品 </p>}
            {!productData && <p>無刊登商品 </p>}
            <button onClick={handleDelete}>刪除帳號</button>
          </div>

          <div className="container">
            <div className=" g-3 row row-cols-xl-4    row-cols-lg-3 row-cols-md-2 row-cols-sm-2  row-cols-1">
              {getCurrentPageProducts().map((product) => {
                return (
                  <div
                    className="col text-center"
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    style={{ margin: "1.5rem 0rem" }}
                  >
                    <div className="productImg ">
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

                      {product.quantity == 0 && (
                        <div className="soldout-item-content">
                          <div>SOLD</div>
                        </div>
                      )}
                    </div>

                    <div>{product.name}</div>
                    {/* <div>{product.quantity}</div> */}
                    <div>NT${product.price}</div>
                  </div>
                );
              })}
            </div>
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
      )}
    </div>
  );
};

export default Profile;
