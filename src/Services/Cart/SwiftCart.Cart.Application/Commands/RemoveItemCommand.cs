using System;

namespace SwiftCart.Cart.Application.Commands;

public record RemoveItemCommand(
    Guid CartId,
    Guid ItemId
);