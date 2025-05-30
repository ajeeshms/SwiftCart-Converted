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
    productName: string; // This is still needed in the DTO returned BY the Cart service
    unitPrice: number;   // This is still needed in the DTO returned BY the Cart service
    quantity: number;
    totalPrice: number;
}

export interface OrderDto {
    id?: string;
    userId?: string;
    orderNumber: string;
    // Changed Status, PaymentStatus, PaymentMethod to number/int based on previous errors and payload
    status: number; // Use number to match the integer payload you sent (0 for Pending)
    totalAmount: number;
    items: OrderItemDto[];
    shippingAddress: AddressDto;
    billingAddress: AddressDto;
    paymentInfo: PaymentInfoDto;
    createdAt: string; // Use string for ISO 8601 timestamp
    updatedAt?: string;
}

export interface OrderItemDto {
    id?: string;
    orderId?: string;
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
    // Changed Status and Method to number/int based on previous errors and payload
    status: number; // Use number to match the integer payload you sent (0 for Pending)
    method: number; // Use number to match the integer payload you sent (1 for Card)
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

// Update payload type for adding item to cart - frontend only sends identifiers and quantity
export interface AddItemPayload {
    userId: string;
    productId: string;
    quantity: number;
    // productName and unitPrice are REMOVED from the payload sent BY the frontend
    // The backend Cart service will fetch these details from the Product service.
}

// --- REMOVED INTERFACE ---
// Removed CreateOrderPayloadWrapper as backend OrdersController.Create expects OrderDto directly.
// export interface CreateOrderPayloadWrapper {
//     orderDto: OrderDto; // This property holds the actual OrderDto object
// }
// --- END REMOVED INTERFACE ---