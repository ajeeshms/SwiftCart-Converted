import { api } from '@/lib/axios';
import { ProductDto } from '@/types';

const baseURL = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:6001';

export const productApi = {
  getAll: (page: number = 1, size: number = 10) => 
    api.get<ProductDto[]>(`${baseURL}/productservice/products?page=${page}&size=${size}`),
  getById: (id: string) => 
      api.get<ProductDto>(`${baseURL}/productservice/products/${id}`),
  getByCategory: (category: string) => 
      api.get<ProductDto[]>(`${baseURL}/productservice/products/category/${category}`),
};