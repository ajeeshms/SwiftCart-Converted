namespace SwiftCart.Contracts.DTOs.Orders;

public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Refunded
}