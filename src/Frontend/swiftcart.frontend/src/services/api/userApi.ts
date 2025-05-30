// filename: src\services\api\userApi.ts
import { api } from '@/lib/axios';
import { UserDto, AuthResponseDto } from '@/types'; // Assuming AuthResponseDto is needed

// const baseURL = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:6001'; // Remove this line

export const userApi = {
    // Update paths to include the service prefix
    // The backend Login controller now returns AuthResponseDto directly
    login: (data: any) => api.post<AuthResponseDto>(`/userservice/users/login`, data),
    register: (data: any) => api.post<UserDto>(`/userservice/users/register`, data),
    getProfile: (id: string) => api.get<UserDto>(`/userservice/users/${id}`),
    updateProfile: (id: string, data: any) => api.put<UserDto>(`/userservice/users/${id}`, data), // Assuming data is UpdateUserDto shape
    // Add logout if backend has one, though authService handles it
    // logout: () => api.post(`/userservice/users/logout`),
};