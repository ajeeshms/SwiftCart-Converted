namespace SwiftCart.Order.Domain.Enums;

public enum PaymentStatus
{
    Pending,
    Authorized,
    Paid,
    Failed,
    Refunded,
    Cancelled
}