import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Shift } from "@/types/staff";

const shiftApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

shiftApi.interceptors.request.use(
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

const getShifts = async (): Promise<AxiosResponse<Shift[]>> => {
  try {
    const response: AxiosResponse<Shift[]> = await shiftApi.get("/shifts");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching shifts:", error);
    throw error;
  }
};

const createShift = async (shiftData: Shift): Promise<AxiosResponse<Shift>> => {
  try {
    const response: AxiosResponse<Shift> = await shiftApi.post("/shifts", shiftData);
    return response;
  } catch (error: unknown) {
    console.error("Error creating shift:", error);
    throw error;
  }
};

const updateShift = async (shiftId: number, shiftData: Shift): Promise<AxiosResponse<Shift>> => {
  try {
    const response: AxiosResponse<Shift> = await shiftApi.patch(`/shifts/${shiftId}`, shiftData);
    return response;
  } catch (error: unknown) {
    console.error("Error updating shift:", error);
    throw error;
  }
};

const deleteShift = async (shiftId: number): Promise<AxiosResponse<void>> => {
  try {
    const response: AxiosResponse<void> = await shiftApi.delete(`/shifts/${shiftId}`);
    return response;
  } catch (error: unknown) {
    console.error("Error deleting shift:", error);
    throw error;
  }
};

export { getShifts, createShift, updateShift, deleteShift };