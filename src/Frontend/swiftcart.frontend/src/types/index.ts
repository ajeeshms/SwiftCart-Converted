// filename: src\types\index.ts
export interface ProductDto {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stockQuantity: number;
    createdAt: string;
    updatedAt?: string;
    isActive: boolean;
}

export interface CartDto {
    id: string;
    userId: string;
    items: CartItemDto[];
    totalAmount: number;
    totalItems: number;
}

export interface CartItemDto {
    id: string;
    cartId: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface OrderDto {
    id: string;
    userId: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    items: OrderItemDto[];
    shippingAddress: AddressDto;
    billingAddress: AddressDto;
    paymentInfo: PaymentInfoDto;
    createdAt: string;
    updatedAt?: string;
}

export interface OrderItemDto {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface AddressDto {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface PaymentInfoDto {
    transactionId: string;
    status: string;
    method: string;
    paidAt?: string;
}

export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string; // Note: Backend User Entity and DTOs had 'Address' as a string.
    createdAt: string;
    updatedAt?: string;
}

// Matches backend SwiftCart.User.Application.DTOs.AuthResponseDto
export interface AuthResponseDto {
    token: string;
    tokenExpiry: string; // Represents DateTime in string format
    user: UserDto; // Refers to the UserDto interface above
}

// Add UpdateUserDto based on backend SwiftCart.User.Application.DTOs.UpdateUserDto
export interface UpdateUserDto {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    // Backend DTO does not include email or address for updates via this endpoint
}