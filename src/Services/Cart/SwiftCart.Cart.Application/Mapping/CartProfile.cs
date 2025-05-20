using AutoMapper;
using SwiftCart.Cart.Application.DTOs;
using SwiftCart.Cart.Domain.Entities;

namespace SwiftCart.Cart.Application.Mapping;

public class CartProfile : Profile
{
    public CartProfile()
    {
        CreateMap<Domain.Entities.Cart, CartDto>();
        CreateMap<CartItem, CartItemDto>();
    }
}