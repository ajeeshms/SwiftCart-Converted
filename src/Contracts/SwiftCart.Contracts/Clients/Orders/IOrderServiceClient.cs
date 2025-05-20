using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SwiftCart.Contracts.DTOs.Orders;

namespace SwiftCart.Contracts.Clients.Orders;

public interface IOrderServiceClient
{
    Task<OrderData> GetByIdAsync(Guid id);
    Task<IEnumerable<OrderData>> GetByUserIdAsync(Guid userId);
    Task<OrderData> CreateAsync(OrderData order);
    Task<OrderData> UpdateAsync(OrderData order);
    Task<OrderData> UpdateStatusAsync(Guid orderId, OrderStatus status);
    Task DeleteAsync(Guid id);
}