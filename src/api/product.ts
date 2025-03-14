import axios, { AxiosInstance, AxiosResponse } from 'axios';

const productApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

productApi.interceptors.request.use(
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

interface ProductData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  sku: string;
  status: number;
  meta: object;
  categories: number[];
  attributes: {
    attribute_id: number;
    value: string;
  }[];
  variants: {
    sku: string;
    price: number;
    stock_quantity: number;
    status: number;
    attributes: {
      attribute_id: number;
      value: string;
    }[];
  }[];
}


const getProducts = async (): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await productApi.get('/products');
    return response;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const createProduct = async (productData: ProductData): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await productApi.post('/products', productData);
    return response;
  } catch (error: any) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const getProductById = async (productId: number): Promise<AxiosResponse> => {
    try {
      const response: AxiosResponse = await productApi.get(`/products/${productId}`);
      return response;
    } catch (error: any) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  };
  

  const deleteProductById = async (productId: number): Promise<AxiosResponse> => {
    try {
      const response: AxiosResponse = await productApi.delete(`/products/${productId}`);
      return response;
    } catch (error: any) {
      console.error(`Error deleting product with ID ${productId}:`, error);
      throw error;
    }
  };

  export { productApi, getProducts, createProduct, getProductById, deleteProductById };