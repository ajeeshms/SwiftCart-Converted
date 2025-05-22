// filename: src\services\api\productApi.ts
import { api } from '@/lib/axios';
import { ProductDto } from '@/types';

// const baseURL = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:6001'; // Remove this line

export const productApi = {
    // Update paths to include the service prefix
    getAll: (page: number = 1, size: number = 10) =>
        api.get<ProductDto[]>(`/productservice/products?page=${page}&size=${size}`),
    getById: (id: string) =>
        api.get<ProductDto>(`/productservice/products/${id}`),
    // The backend endpoint is actually /productservice/products/category/{category}, not just /category/
    getByCategory: (category: string) =>
        api.get<ProductDto[]>(`/productservice/products/category/${category}`),
};