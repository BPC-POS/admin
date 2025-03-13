import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Discount } from '../types/discount';

const discountApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

discountApi.interceptors.request.use(
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

const getDiscounts = async (): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await discountApi.get('/discounts');
    return response;
  } catch (error: any) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};

const createDiscount = async (discountData: Discount): Promise<AxiosResponse> => {
    try {
        const response: AxiosResponse = await discountApi.post('/discounts', {
        code: discountData.code,
        description: discountData.description,
        discount_percentage: discountData.discount_percentage,
        start_date: discountData.start_date,
        end_date: discountData.end_date,
        status: discountData.status,
        });
        return response;
    } catch (error: any) {
        console.error("Error creating discount:", error);
        throw error;
    }
};

const getDiscountByCode = async (code: string): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await discountApi.get(`/discounts/${code}`);
    return response;
  } catch (error: any) {
    console.error("Error fetching discount:", error);
    throw error;
  }
};

const updateDiscount = async (code: string, discountData: Discount): Promise<AxiosResponse> => {
    try {
        const response: AxiosResponse = await discountApi.put(`/discounts/${code}`, {
        code: discountData.code,
        description: discountData.description,
        discount_percentage: discountData.discount_percentage,
        start_date: discountData.start_date,
        end_date: discountData.end_date,
        status: discountData.status,
        });
        return response;
    }
    catch (error: any) {
        console.error("Error updating discount:", error);
        throw error;
    }
};


const deleteDiscount = async (code: string): Promise<AxiosResponse> => {
    try {
        const response: AxiosResponse = await discountApi.delete(`/discounts/${code}`);
        return response;
    } catch (error: any) {
        console.error("Error deleting discount:", error);
        throw error;
    }
};

export { discountApi, getDiscounts, createDiscount, getDiscountByCode, updateDiscount, deleteDiscount };


