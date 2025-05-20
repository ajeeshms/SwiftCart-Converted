using Microsoft.Extensions.DependencyInjection;
using SwiftCart.Cart.Application.Interfaces;
using SwiftCart.Cart.Application.Services;
using System.Reflection;

namespace SwiftCart.Cart.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddScoped<ICartService, CartService>();
        
        return services;
    }
}