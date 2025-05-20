import { api } from '@/lib/axios';
import { OrderDto } from '@/types';

const baseURL = import.meta.env.VITE_ORDER_API_URL;

export const orderApi = {
  getById: (id: string) => api.get<OrderDto>(`${baseURL}/api/orders/${id}`),
  getByUserId: (userId: string) => api.get<OrderDto[]>(`${baseURL}/api/orders/user/${userId}`),
  create: (data: any) => api.post<OrderDto>(`${baseURL}/api/orders`, data),
  updateStatus: (id: string, status: string) => api.patch<OrderDto>(`${baseURL}/api/orders/${id}/status`, { status }),
};