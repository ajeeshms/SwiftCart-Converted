using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SwiftCart.Contracts.DTOs.Products;

namespace SwiftCart.Contracts.Clients.Products;

public interface IProductServiceClient
{
    Task<ProductData> GetByIdAsync(Guid id);
    Task<IEnumerable<ProductData>> GetAllAsync();
    Task<IEnumerable<ProductData>> GetByCategoryAsync(string category);
    Task<ProductData> CreateAsync(ProductData product);
    Task<ProductData> UpdateAsync(ProductData product);
    Task DeleteAsync(Guid id);
}