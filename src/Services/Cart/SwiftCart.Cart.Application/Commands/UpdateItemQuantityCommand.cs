using System;

namespace SwiftCart.Cart.Application.Commands;

public record UpdateItemQuantityCommand(
    Guid CartId,
    Guid ItemId,
    int Quantity
);