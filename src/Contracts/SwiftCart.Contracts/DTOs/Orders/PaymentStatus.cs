namespace SwiftCart.Contracts.DTOs.Orders;

public enum PaymentStatus
{
    Pending,
    Authorized,
    Paid,
    Failed,
    Refunded,
    Cancelled
}