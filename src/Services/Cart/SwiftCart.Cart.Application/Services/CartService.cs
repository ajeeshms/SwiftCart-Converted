using System;
using System.Threading.Tasks;
using AutoMapper;
using SwiftCart.Cart.Application.Commands;
using SwiftCart.Cart.Application.DTOs;
using SwiftCart.Cart.Application.Interfaces;
using SwiftCart.Cart.Domain.Repositories;

namespace SwiftCart.Cart.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IMapper _mapper;

    public CartService(ICartRepository cartRepository, IMapper mapper)
    {
        _cartRepository = cartRepository;
        _mapper = mapper;
    }

    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        return _mapper.Map<CartDto>(cart);
    }

    public async Task<CartDto> AddItemAsync(AddItemCommand command)
    {
        var cart = await _cartRepository.GetByIdAsync(command.CartId);
        
        var cartItem = new Domain.Entities.CartItem
        {
            Id = Guid.NewGuid(),
            CartId = command.CartId,
            ProductId = command.ProductId,
            ProductName = command.ProductName,
            UnitPrice = command.UnitPrice,
            Quantity = command.Quantity,
            CreatedAt = DateTime.UtcNow
        };

        cart.Items.Add(cartItem);
        cart.UpdatedAt = DateTime.UtcNow;

        await _cartRepository.UpdateAsync(cart);
        return _mapper.Map<CartDto>(cart);
    }

    public async Task<CartDto> UpdateItemQuantityAsync(UpdateItemQuantityCommand command)
    {
        var cart = await _cartRepository.GetByIdAsync(command.CartId);
        var item = cart.Items.Find(i => i.Id == command.ItemId);

        if (item == null)
            throw new KeyNotFoundException($"Cart item {command.ItemId} not found");

        item.Quantity = command.Quantity;
        item.UpdatedAt = DateTime.UtcNow;
        cart.UpdatedAt = DateTime.UtcNow;

        await _cartRepository.UpdateAsync(cart);
        return _mapper.Map<CartDto>(cart);
    }

    public async Task<CartDto> RemoveItemAsync(RemoveItemCommand command)
    {
        var cart = await _cartRepository.GetByIdAsync(command.CartId);
        cart.Items.RemoveAll(i => i.Id == command.ItemId);
        cart.UpdatedAt = DateTime.UtcNow;

        await _cartRepository.UpdateAsync(cart);
        return _mapper.Map<CartDto>(cart);
    }

    public async Task ClearCartAsync(Guid cartId)
    {
        var cart = await _cartRepository.GetByIdAsync(cartId);
        cart.Items.Clear();
        cart.UpdatedAt = DateTime.UtcNow;

        await _cartRepository.UpdateAsync(cart);
    }
}