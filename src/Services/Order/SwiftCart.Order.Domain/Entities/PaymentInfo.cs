using System;
using SwiftCart.Order.Domain.Enums;

namespace SwiftCart.Order.Domain.Entities;

public class PaymentInfo
{
    public Guid TransactionId { get; set; }
    public PaymentStatus Status { get; set; }
    public PaymentMethod Method { get; set; }
    public DateTime? PaidAt { get; set; }
}