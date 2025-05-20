using Microsoft.EntityFrameworkCore;
using SwiftCart.Order.Domain.Repositories;
using SwiftCart.Order.Infrastructure.Data;

namespace SwiftCart.Order.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly OrderDbContext _context;

    public OrderRepository(OrderDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Entities.Order> GetByIdAsync(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            throw new KeyNotFoundException($"Order with ID {id} not found");

        return order;
    }

    public async Task<IEnumerable<Domain.Entities.Order>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .ToListAsync();
    }

    public async Task<Domain.Entities.Order> CreateAsync(Domain.Entities.Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task<Domain.Entities.Order> UpdateAsync(Domain.Entities.Order order)
    {
        _context.Entry(order).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task DeleteAsync(Guid id)
    {
        var order = await GetByIdAsync(id);
        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
    }
}