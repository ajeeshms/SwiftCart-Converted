using AutoMapper;
using SwiftCart.Product.Application.DTOs;
using SwiftCart.Product.Application.Interfaces;
using SwiftCart.Product.Domain.Repositories;

namespace SwiftCart.Product.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public ProductService(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ProductDto> GetByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync(int page, int size)
    {
        var products = await _productRepository.GetAllAsync(page, size);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<IEnumerable<ProductDto>> GetByCategoryAsync(string category)
    {
        var products = await _productRepository.GetByCategoryAsync(category);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<ProductDto> CreateAsync(ProductDto productDto)
    {
        var product = _mapper.Map<Domain.Entities.Product>(productDto);
        var createdProduct = await _productRepository.CreateAsync(product);
        return _mapper.Map<ProductDto>(createdProduct);
    }

    public async Task<ProductDto> UpdateAsync(ProductDto productDto)
    {
        var product = _mapper.Map<Domain.Entities.Product>(productDto);
        var updatedProduct = await _productRepository.UpdateAsync(product);
        return _mapper.Map<ProductDto>(updatedProduct);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _productRepository.DeleteAsync(id);
    }
}