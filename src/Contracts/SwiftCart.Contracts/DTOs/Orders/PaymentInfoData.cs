namespace SwiftCart.Contracts.DTOs.Orders;

public class PaymentInfoData
{
    public Guid TransactionId { get; set; }
    public PaymentStatus Status { get; set; }
    public PaymentMethod Method { get; set; }
    public DateTime? PaidAt { get; set; }
}