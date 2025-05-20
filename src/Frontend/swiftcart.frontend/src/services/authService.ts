import { api } from '@/lib/axios';
import { RegisterDto } from '@/types/auth';

const baseURL = import.meta.env.VITE_USER_API_URL;

export async function login(credentials: { email: string; password: string }) {
  const response = await api.post(`${baseURL}/userservice/users/login`, credentials);
  return response.data;
}

export async function register(data: RegisterDto) {
  const response = await api.post(`${baseURL}/userservice/users/register`, data);
  return response.data;
}

export async function logout() {
  const response = await api.post(`${baseURL}/userservice/users/logout`);
  return response.data;
}