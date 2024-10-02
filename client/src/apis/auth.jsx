import axios from "axios";

const BACKEND_URL = "";

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/register`, {
      username,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message);
    } else {
      console.error(error);
      throw new Error("An error occurred while registering.");
    }
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, {
      username,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message);
    }
    if (error.response && error.response.status === 401) {
      throw new Error(error.response.data.message);
    } else {
      console.error(error);
      throw new Error("An error occurred while logging in.");
    }
  }
};
