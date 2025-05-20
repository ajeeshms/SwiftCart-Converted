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
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}