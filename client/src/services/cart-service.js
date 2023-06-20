import axios from "axios";
const API_URL = "http://localhost:8080/cart";
class CartService {
  CartAdd(productID, quantity) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/" + productID + "/purchase",
      { quantity },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  getCart() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL, {
      headers: {
        Authorization: token,
      },
    });
  }

  quantityUpdate(productId, quantity) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(API_URL + "/items/" + productId, quantity, {
      headers: {
        Authorization: token,
      },
    });
  }

  productDelete(productId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/items/" + productId, {
      headers: {
        Authorization: token,
      },
    });
  }

  checkOut() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(API_URL + "/checkout", null, {
      headers: {
        Authorization: token,
      },
    });
  }
}
export default new CartService();
