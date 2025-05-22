// filename: src\services\authService.ts
import { api } from '@/lib/axios';
// Make sure LoginDto, RegisterDto, and AuthResponse are imported from '@/types/auth'
import { RegisterDto, LoginDto, AuthResponse } from '@/types/auth';
// AuthResponseDto and UserDto are imported from '@/types' (src/types/index.ts)
import { AuthResponseDto, UserDto } from '@/types';

// const baseURL = import.meta.env.VITE_USER_API_URL; // Removed as api instance handles base URL

export async function login(credentials: LoginDto): Promise<AuthResponse> {
    // Use service prefix and expect the backend AuthResponseDto structure
    // Note: The backend UsersController.Login returns { User: UserDto } and sets a cookie for the token.
    // The frontend expects AuthResponse { token, user } for useAuthStore.setAuth.
    // Assuming the backend *should* return AuthResponseDto { token, user }, as per the backend DTO definition.
    // If the backend truly only returns { User: UserDto } and cookie, this mapping will need adjustment.
    const response = await api.post<AuthResponseDto>(`/userservice/users/login`, credentials);

    // Map the backend AuthResponseDto to the frontend AuthResponse type
    // This ensures the structure matches what useAuthStore expects.
    // If backend only returns { user: UserDto } and sets cookie, this mapping won't work directly.
    // You'd need to potentially get the token from the cookie after the successful response
    // or rely solely on the cookie for auth. The current approach assumes the token is in the body.
    const authResponse: AuthResponse = {
        token: response.data.token, // Get token from backend DTO
        user: { // Map backend UserDto to frontend AuthResponse['user'] structure (subset of UserDto)
            id: response.data.user.id,
            email: response.data.user.email,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            // Note: AuthResponse['user'] doesn't have phoneNumber or address, only the fields needed by Header/AuthStore
        }
    };

    return authResponse;
}

export async function register(data: RegisterDto): Promise<UserDto> {
    // Use service prefix, expect UserDto from backend (as per UsersController.Register)
    const response = await api.post<UserDto>(`/userservice/users/register`, data);
    return response.data;
}

export async function logout() {
    // Use service prefix
    const response = await api.post(`/userservice/users/logout`);
    return response.data;
}