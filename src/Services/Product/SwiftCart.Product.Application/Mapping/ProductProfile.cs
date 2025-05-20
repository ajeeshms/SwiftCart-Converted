using AutoMapper;
using SwiftCart.Product.Application.DTOs;
using SwiftCart.Product.Domain.Entities;

namespace SwiftCart.Product.Application.Mapping;

public class ProductProfile : Profile
{
    public ProductProfile()
    {
        CreateMap<Domain.Entities.Product, ProductDto>();
    }
}