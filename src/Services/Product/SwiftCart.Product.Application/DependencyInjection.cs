using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using System.Reflection;
using SwiftCart.Product.Application.Interfaces;
using SwiftCart.Product.Application.Services;

namespace SwiftCart.Product.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        
        services.AddScoped<IProductService, ProductService>();
        
        return services;
    }
}