using Microsoft.EntityFrameworkCore;
using SwiftCart.User.Domain.Repositories;
using SwiftCart.User.Infrastructure.Data;

namespace SwiftCart.User.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly UserDbContext _context;

    public UserRepository(UserDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Entities.User> GetByIdAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        return user ?? throw new KeyNotFoundException($"User with ID {id} not found");
    }

    public async Task<Domain.Entities.User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<Domain.Entities.User> CreateAsync(Domain.Entities.User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<Domain.Entities.User> UpdateAsync(Domain.Entities.User user)
    {
        _context.Entry(user).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await GetByIdAsync(id);
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }
}