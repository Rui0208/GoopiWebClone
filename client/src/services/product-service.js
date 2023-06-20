import axios from "axios";
import { useNavigate } from "react-router-dom";
import { withRouter } from "react-router-dom";
const API_URL = "http://localhost:8080/product";

class ProductService {
  //首頁全部商品
  getAll() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get("http://localhost:8080/product/categories/new-arrivals", {
      headers: {
        Authorization: token,
      },
    });
  }

  //上架商品
  post(productData) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(API_URL + "/add", productData, {
      headers: {
        Authorization: token,
      },
    });
  }
  //使用者個人商品
  get() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    console.log(token);
    return axios.get(API_URL + "/profile", {
      headers: {
        Authorization: token,
      },
    });
  }
  //商品頁面
  //   getById(_id) {
  //     let token;
  //     if (localStorage.getItem("user")) {
  //       token = JSON.parse(localStorage.getItem("user")).token;
  //     } else {
  //       token = "";
  //     }
  //     console.log(token);
  //     return axios.get(API_URL + "/" + _id, {
  //       headers: {
  //         Authorization: token,
  //       },
  //     })
  //   }
  // }
  //透過product_id商品
  getById(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
  //編輯商品
  editProduct(productId, updateItem) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "/profile/" + productId,
      updateItem,

      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  search(keyword) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/search/" + keyword, {
      headers: {
        Authorization: token,
      },
    });
  }
  //get同類別商品
  getCategory(category) {
    return axios.get(API_URL + "/categories/" + category);
  }
  //get同品牌商品
  getBrand(brand) {
    return axios.get(API_URL + "/brands/" + brand);
  }
  //刪除刪品
  delete(productId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/profile/" + productId, {
      headers: {
        Authorization: token,
      },
    });
  }
}
export default new ProductService();
