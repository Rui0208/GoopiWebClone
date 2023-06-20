import axios from "axios";
const API_URL = "http://localhost:8080/auth";

class AuthService {
  register(username, account, password) {
    return axios.post(API_URL + "/register", {
      username,
      account,
      password,
    });
  }
  login(account, password) {
    return axios.post(API_URL + "/login", { account, password });
  }
  logout() {
    localStorage.removeItem("user");
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getUser(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/user/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
  editUser(_id, updatedItem) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(API_URL + "/update/" + _id, updatedItem, {
      headers: {
        Authorization: token,
      },
    });
  }
  editPassword(_id, updatedItem) {
    console.log(updatedItem);
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(API_URL + "/editPassword/" + _id, updatedItem, {
      headers: {
        Authorization: token,
      },
    });
  }
  deleteUser(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/delete/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
}
export default new AuthService();
