using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SwiftCart.Order.Application.DTOs;

namespace SwiftCart.Order.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> GetByIdAsync(Guid id);
    Task<IEnumerable<OrderDto>> GetByUserIdAsync(Guid userId);
    Task<OrderDto> CreateOrderAsync(OrderDto orderDto);
    Task<OrderDto> UpdateOrderAsync(OrderDto orderDto);
    Task<OrderDto> UpdateOrderStatusAsync(Guid orderId, Domain.Enums.OrderStatus status);
    Task DeleteOrderAsync(Guid id);
}