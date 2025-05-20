using System;
using System.Collections.Generic;

namespace SwiftCart.Cart.Application.DTOs;

public class CartDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalAmount => Items.Sum(item => item.TotalPrice);
    public int TotalItems => Items.Sum(item => item.Quantity);
}