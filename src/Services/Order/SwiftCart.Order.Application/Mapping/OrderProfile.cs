using AutoMapper;
using SwiftCart.Order.Application.DTOs;
using SwiftCart.Order.Domain.Entities;

namespace SwiftCart.Order.Application.Mapping;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<Domain.Entities.Order, OrderDto>();
        CreateMap<OrderItem, OrderItemDto>();
        CreateMap<Address, AddressDto>();
        CreateMap<PaymentInfo, PaymentInfoDto>();
    }
}