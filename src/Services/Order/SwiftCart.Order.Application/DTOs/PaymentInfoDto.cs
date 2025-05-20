using System;
using SwiftCart.Order.Domain.Enums;

namespace SwiftCart.Order.Application.DTOs;

public class PaymentInfoDto
{
    public Guid TransactionId { get; set; }
    public PaymentStatus Status { get; set; }
    public PaymentMethod Method { get; set; }
    public DateTime? PaidAt { get; set; }
}