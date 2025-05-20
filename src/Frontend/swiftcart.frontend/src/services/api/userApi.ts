import { api } from '@/lib/axios';
import { UserDto, AuthResponseDto } from '@/types';

const baseURL = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:6001';

export const userApi = {
  login: (data: any) => api.post<AuthResponseDto>(`${baseURL}/userservice/users/login`, data),
  register: (data: any) => api.post<UserDto>(`${baseURL}/userservice/users/register`, data),
  getProfile: (id: string) => api.get<UserDto>(`${baseURL}/userservice/users/${id}`),
  updateProfile: (id: string, data: any) => api.put<UserDto>(`${baseURL}/userservice/users/${id}`, data),
};