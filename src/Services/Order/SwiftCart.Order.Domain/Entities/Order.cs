using System;
using System.Collections.Generic;
using SwiftCart.Order.Domain.Enums;

namespace SwiftCart.Order.Domain.Entities;

public class Order
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public Address ShippingAddress { get; set; } = new();
    public Address BillingAddress { get; set; } = new();
    public PaymentInfo PaymentInfo { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}