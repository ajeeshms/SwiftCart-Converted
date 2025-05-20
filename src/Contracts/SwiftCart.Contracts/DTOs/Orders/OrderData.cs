using System;
using System.Collections.Generic;

namespace SwiftCart.Contracts.DTOs.Orders;

public class OrderData
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItemData> Items { get; set; } = new();
    public AddressData ShippingAddress { get; set; } = new();
    public AddressData BillingAddress { get; set; } = new();
    public PaymentInfoData PaymentInfo { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}