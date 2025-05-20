using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SwiftCart.Product.Domain.Entities;

namespace SwiftCart.Product.Domain.Repositories;

public interface IProductRepository
{
    Task<Entities.Product> GetByIdAsync(Guid id);
    Task<IEnumerable<Entities.Product>> GetAllAsync(int page, int size);
    Task<IEnumerable<Entities.Product>> GetByCategoryAsync(string category);
    Task<Entities.Product> CreateAsync(Entities.Product product);
    Task<Entities.Product> UpdateAsync(Entities.Product product);
    Task DeleteAsync(Guid id);
}