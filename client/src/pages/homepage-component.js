import React, { useEffect, useState } from "react";
import ProductService from "../services/product-service";
import { useNavigate } from "react-router-dom";
import ProductALL from "../components/productALL-component";
const Homepage = ({ setShowCart, showCart }) => {
  let [productData, setProductData] = useState(null);
  let [homeItem, setHomeItem] = useState("/images/homeItem1.webp");
  const [currentDot, setCurrentDot] = useState(0);
  const navigate = useNavigate();
  const dots = [
    "/images/homeItem1.webp",
    "/images/homeItem2.webp",
    "/images/homeItem3.webp",
    "/images/homeItem4.webp",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDot((prevDot) => (prevDot + 1) % dots.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHomeItem(dots[currentDot]);
  }, [currentDot]);

  // productData &&
  //   productData.map((product) => {
  //     if (product.quantity === 0) {
  //       soldOut.classList.add("sold-out");
  //     }
  //   });

  useEffect(() => {
    ProductService.getAll()
      .then((data) => {
        setProductData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div>
      <div>
        <img
          src={homeItem}
          alt=""
          style={{ width: "100%", height: "560px", marginBottom: "1rem" }}
        />
        <div className="dots">
          <div className="dot-container">
            {dots.map((dot, index) => (
              <div
                onClick={() => {
                  // setHomeItem(dots[index]);
                  setCurrentDot(index % dots.length);
                }}
                className={`dot ${index === currentDot ? "active" : ""}`}
                key={index}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <p style={{ fontSize: "2rem", position: "relative", left: "2rem" }}>
        NEW ARRIVALS
      </p>
      <ProductALL
        productData={productData}
        setShowCart={setShowCart}
        showCart={showCart}
      />
    </div>
  );
};

export default Homepage;
