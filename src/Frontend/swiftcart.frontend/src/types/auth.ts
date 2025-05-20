export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}