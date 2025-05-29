// filename: src\services\api\cartApi.ts
import { api } from '@/lib/axios';
// Import the updated AddItemPayload type
import { CartDto, AddItemPayload } from '@/types';

// const baseURL = import.meta.env.VITE_API_URL; // Remove this line

export const cartApi = {
    // Update paths to include the service prefix
    getCart: (userId: string) => api.get<CartDto>(`/cartservice/cart/${userId}`),
    // Update the type of data expected by addItem to AddItemPayload (now simpler)
    addItem: (data: AddItemPayload) => api.post<CartDto>(`/cartservice/cart/items`, data),
    updateItemQuantity: (data: { cartId: string; itemId: string; quantity: number }) => api.put<CartDto>(`/cartservice/cart/items`, data),
    removeItem: (cartId: string, itemId: string) => api.delete<CartDto>(`/cartservice/cart/${cartId}/items/${itemId}`),
    clearCart: (cartId: string) => api.delete(`/cartservice/cart/${cartId}`),
};