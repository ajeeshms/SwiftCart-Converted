using Microsoft.Extensions.DependencyInjection;
using SwiftCart.Order.Application.Interfaces;
using SwiftCart.Order.Application.Services;
using System.Reflection;

namespace SwiftCart.Order.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddScoped<IOrderService, OrderService>();
        
        return services;
    }
}