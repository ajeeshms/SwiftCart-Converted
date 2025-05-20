using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using SwiftCart.Order.Application.DTOs;
using SwiftCart.Order.Application.Interfaces;
using SwiftCart.Order.Domain.Repositories;

namespace SwiftCart.Order.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMapper _mapper;

    public OrderService(IOrderRepository orderRepository, IMapper mapper)
    {
        _orderRepository = orderRepository;
        _mapper = mapper;
    }

    public async Task<OrderDto> GetByIdAsync(Guid id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        return _mapper.Map<OrderDto>(order);
    }

    public async Task<IEnumerable<OrderDto>> GetByUserIdAsync(Guid userId)
    {
        var orders = await _orderRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<OrderDto> CreateOrderAsync(OrderDto orderDto)
    {
        var order = _mapper.Map<Domain.Entities.Order>(orderDto);
        order.CreatedAt = DateTime.UtcNow;
        
        var createdOrder = await _orderRepository.CreateAsync(order);
        return _mapper.Map<OrderDto>(createdOrder);
    }

    public async Task<OrderDto> UpdateOrderAsync(OrderDto orderDto)
    {
        var order = _mapper.Map<Domain.Entities.Order>(orderDto);
        order.UpdatedAt = DateTime.UtcNow;
        
        var updatedOrder = await _orderRepository.UpdateAsync(order);
        return _mapper.Map<OrderDto>(updatedOrder);
    }

    public async Task<OrderDto> UpdateOrderStatusAsync(Guid orderId, Domain.Enums.OrderStatus status)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;
        
        var updatedOrder = await _orderRepository.UpdateAsync(order);
        return _mapper.Map<OrderDto>(updatedOrder);
    }

    public async Task DeleteOrderAsync(Guid id)
    {
        await _orderRepository.DeleteAsync(id);
    }
}