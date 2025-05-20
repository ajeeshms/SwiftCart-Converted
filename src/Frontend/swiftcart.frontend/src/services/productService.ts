import { api } from '@/lib/axios';
import { ProductDto } from '@/types';

const baseURL = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:6001';

export async function getById(id: string) {
  const response = await api.get<ProductDto>(`${baseURL}/productservice/products/${id}`);
  return response.data;
}

export async function getAll(page: number = 1, size: number = 10) {
    const response = await api.get<ProductDto[]>(`${baseURL}/productservice/products?page=${page}&size=${size}`);
  return response.data;
}

export async function getByCategory(category: string) {
    const response = await api.get<ProductDto[]>(`${baseURL}/productservice/products/category/${category}`);
  return response.data;
}