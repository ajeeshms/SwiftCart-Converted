using SwiftCart.Cart.Application.Commands;
using SwiftCart.Cart.Application.DTOs;
using System;
using System.Threading.Tasks;

namespace SwiftCart.Cart.Application.Interfaces {
    public interface ICartService {
        Task<CartDto> GetCartAsync(Guid userId);
        Task<CartDto> AddItemAsync(AddItemCommand command); // Method signature remains, but Command shape changes
        Task<CartDto> UpdateItemQuantityAsync(UpdateItemQuantityCommand command);
        Task<CartDto> RemoveItemAsync(RemoveItemCommand command);
        Task ClearCartAsync(Guid cartId);
    }
}