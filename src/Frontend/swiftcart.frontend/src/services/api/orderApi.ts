// filename: src\services\api\orderApi.ts
import { api } from '@/lib/axios';
// Import the new wrapper type
// Removed CreateOrderPayloadWrapper as backend expects OrderDto directly
import { OrderDto } from '@/types';

// const baseURL = import.meta.env.VITE_ORDER_API_URL; // Remove this line

export const orderApi = {
    // Update paths to include the service prefix
    getById: (id: string) => api.get<OrderDto>(`/orderservice/orders/${id}`),
    getByUserId: (userId: string) => api.get<OrderDto[]>(`/orderservice/orders/user/${userId}`),
    // --- UPDATED METHOD SIGNATURE ---
    // Change the type of data expected by the create method to OrderDto
    // The backend controller expects the OrderDto directly in the body.
    create: (data: OrderDto) => api.post<OrderDto>(`/orderservice/orders`, data),
    // --- END UPDATED METHOD SIGNATURE ---
    updateStatus: (id: string, status: string) => api.patch<OrderDto>(`/orderservice/orders/${id}/status`, { status }),
    // Assuming OrderDto can be used for creation, might need a dedicated CreateOrderDto later
    // Add the invoice export endpoint
    exportInvoiceExcel: (id: string) => api.get<Blob>(`/orderservice/orders/${id}/invoice/excel`, {
        responseType: 'blob' // Important: tell axios to expect binary data
    }),
};