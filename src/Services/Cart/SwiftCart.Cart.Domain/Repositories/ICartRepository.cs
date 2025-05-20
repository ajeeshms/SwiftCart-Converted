using System;
using System.Threading.Tasks;
using SwiftCart.Cart.Domain.Entities;

namespace SwiftCart.Cart.Domain.Repositories;

public interface ICartRepository
{
    Task<Entities.Cart> GetByIdAsync(Guid id);
    Task<Entities.Cart> GetByUserIdAsync(Guid userId);
    Task<Entities.Cart> CreateAsync(Entities.Cart cart);
    Task<Entities.Cart> UpdateAsync(Entities.Cart cart);
    Task DeleteAsync(Guid id);
}