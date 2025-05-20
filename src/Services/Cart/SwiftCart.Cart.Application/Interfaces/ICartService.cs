using System;
using System.Threading.Tasks;
using SwiftCart.Cart.Application.Commands;
using SwiftCart.Cart.Application.DTOs;

namespace SwiftCart.Cart.Application.Interfaces;

public interface ICartService
{
    Task<CartDto> GetCartAsync(Guid userId);
    Task<CartDto> AddItemAsync(AddItemCommand command);
    Task<CartDto> UpdateItemQuantityAsync(UpdateItemQuantityCommand command);
    Task<CartDto> RemoveItemAsync(RemoveItemCommand command);
    Task ClearCartAsync(Guid cartId);
}