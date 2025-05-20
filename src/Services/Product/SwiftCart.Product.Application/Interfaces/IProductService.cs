using SwiftCart.Product.Application.DTOs;

namespace SwiftCart.Product.Application.Interfaces;

public interface IProductService
{
    Task<ProductDto> GetByIdAsync(Guid id);
    Task<IEnumerable<ProductDto>> GetAllAsync(int page, int size);
    Task<IEnumerable<ProductDto>> GetByCategoryAsync(string category);
    Task<ProductDto> CreateAsync(ProductDto productDto);
    Task<ProductDto> UpdateAsync(ProductDto productDto);
    Task DeleteAsync(Guid id);
}