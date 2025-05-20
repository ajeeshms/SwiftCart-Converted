import { api } from '@/lib/axios';
import { CartDto } from '@/types';

const baseURL = import.meta.env.VITE_API_URL;

export const cartApi = {
  getCart: (userId: string) => api.get<CartDto>(`${baseURL}/api/cart/${userId}`),
  addItem: (data: any) => api.post<CartDto>(`${baseURL}/api/cart/items`, data),
  updateItemQuantity: (data: any) => api.put<CartDto>(`${baseURL}/api/cart/items`, data),
  removeItem: (cartId: string, itemId: string) => api.delete<CartDto>(`${baseURL}/api/cart/${cartId}/items/${itemId}`),
};