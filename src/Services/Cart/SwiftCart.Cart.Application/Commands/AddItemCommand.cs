using System;

namespace SwiftCart.Cart.Application.Commands;

public record AddItemCommand(
    Guid CartId,
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    int Quantity
);