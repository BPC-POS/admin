import axios, { AxiosInstance, AxiosResponse } from "axios";
import { User } from "@/types/user";

const userApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getUsers = async (): Promise<AxiosResponse<User[]>> => { 
  try {
    const response: AxiosResponse<User[]> = await userApi.get("/users");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const updateUserFCM = async (firebase_token: string): Promise<AxiosResponse<User>> => {
  try {
    console.log(firebase_token);
    const response = await userApi.patch(`/users/me`, firebase_token);
    return response;
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export { userApi, getUsers, updateUserFCM };