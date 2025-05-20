using System;
using System.Threading.Tasks;
using SwiftCart.Contracts.DTOs.Cart;

namespace SwiftCart.Contracts.Clients.Cart;

public interface ICartServiceClient
{
    Task<CartData> GetCartAsync(Guid userId);
    Task<CartData> AddItemAsync(AddCartItemData command);
    Task<CartData> UpdateItemQuantityAsync(UpdateCartItemQuantityData command);
    Task<CartData> RemoveItemAsync(RemoveCartItemData command);
    Task ClearCartAsync(Guid cartId);
}