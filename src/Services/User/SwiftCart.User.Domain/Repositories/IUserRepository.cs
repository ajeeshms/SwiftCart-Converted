using System;
using System.Threading.Tasks;
using SwiftCart.User.Domain.Entities;

namespace SwiftCart.User.Domain.Repositories;

public interface IUserRepository
{
    Task<Entities.User> GetByIdAsync(Guid id);
    Task<Entities.User?> GetByEmailAsync(string email);
    Task<Entities.User> CreateAsync(Entities.User user);
    Task<Entities.User> UpdateAsync(Entities.User user);
    Task DeleteAsync(Guid id);
}