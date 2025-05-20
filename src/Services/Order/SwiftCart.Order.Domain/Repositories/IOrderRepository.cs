using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SwiftCart.Order.Domain.Entities;

namespace SwiftCart.Order.Domain.Repositories;

public interface IOrderRepository
{
    Task<Entities.Order> GetByIdAsync(Guid id);
    Task<IEnumerable<Entities.Order>> GetByUserIdAsync(Guid userId);
    Task<Entities.Order> CreateAsync(Entities.Order order);
    Task<Entities.Order> UpdateAsync(Entities.Order order);
    Task DeleteAsync(Guid id);
}