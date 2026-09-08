// src/sdk/client.ts
import { POST_SETTINGS } from "./PostSettings";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: POST_SETTINGS.baseUrl,
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API Error:", {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);
