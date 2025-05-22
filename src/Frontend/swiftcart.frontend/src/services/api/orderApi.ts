// filename: src\services\api\orderApi.ts
import { api } from '@/lib/axios';
import { OrderDto } from '@/types';

// const baseURL = import.meta.env.VITE_ORDER_API_URL; // Remove this line

export const orderApi = {
    // Update paths to include the service prefix
    getById: (id: string) => api.get<OrderDto>(`/orderservice/orders/${id}`),
    getByUserId: (userId: string) => api.get<OrderDto[]>(`/orderservice/orders/user/${userId}`),
    create: (data: OrderDto) => api.post<OrderDto>(`/orderservice/orders`, data), // Adjusted data type to OrderDto
    updateStatus: (id: string, status: string) => api.patch<OrderDto>(`/orderservice/orders/${id}/status`, { status }),
    // Assuming OrderDto can be used for creation, might need a dedicated CreateOrderDto later
};