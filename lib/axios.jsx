import { BASE_URL } from "@/config/constant";
import axios from "axios";

const client = axios.create({
  // Your Axios configuration options, such as baseURL
  baseURL: BASE_URL,
});

export const request = ({ ...options }) => {
  const bearerToken = sessionStorage.getItem("token");
  client.defaults.headers["Authorization"] = bearerToken;
  const onSuccess = (response) => response.data.data;
  // const onError = (error) => error.response.data.message;
  const onError = (error) => {
    // If there's no response from the server (e.g., network error)
    if (!error?.response) {
      return {
        success: false,
        message: "Network Error: Please check your connection.",
      };
    }
    // If the server responded with an error, return the error data
    return {
      success: false,
      message: error.response.data?.message || "An error occurred.",
      status: error.response.status,
    };
  };

  return client(options).then(onSuccess).catch(onError);
};

export const requestObject = ({ ...options }) => {
  const bearerToken = sessionStorage.getItem("token");
  client.defaults.headers["Authorization"] = bearerToken;
  const onSuccess = (response) => response;
  const onError = (error) => {
    return error;
  };

  return client(options).then(onSuccess).catch(onError);
};

export const requestWithCount = ({ ...options }) => {
  const bearerToken = sessionStorage.getItem("token");
  client.defaults.headers["Authorization"] = bearerToken;
  const onSuccess = (response) => {
    const { data, totalCount, totalPages } = response.data;
    return { data, totalCount, totalPages };
  };
  const onError = (error) => {
    return error;
  };

  return client(options).then(onSuccess).catch(onError);
};
