using Microsoft.EntityFrameworkCore;
using SwiftCart.Product.Domain.Repositories;
using SwiftCart.Product.Infrastructure.Data;

namespace SwiftCart.Product.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ProductDbContext _context;

    public ProductRepository(ProductDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Entities.Product> GetByIdAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        return product ?? throw new KeyNotFoundException($"Product with ID {id} not found");
    }

    public async Task<IEnumerable<Domain.Entities.Product>> GetAllAsync(int page, int size)
    {
        return await _context.Products.Skip((page * size) - size).Take(size).ToListAsync();
    }

    public async Task<IEnumerable<Domain.Entities.Product>> GetByCategoryAsync(string category)
    {
        return await _context.Products
            .Where(p => p.Category == category)
            .ToListAsync();
    }

    public async Task<Domain.Entities.Product> CreateAsync(Domain.Entities.Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Domain.Entities.Product> UpdateAsync(Domain.Entities.Product product)
    {
        var existingProduct = await GetByIdAsync(product.Id);
        
        _context.Entry(existingProduct).CurrentValues.SetValues(product);
        await _context.SaveChangesAsync();
        
        return existingProduct;
    }

    public async Task DeleteAsync(Guid id)
    {
        var product = await GetByIdAsync(id);
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }
}