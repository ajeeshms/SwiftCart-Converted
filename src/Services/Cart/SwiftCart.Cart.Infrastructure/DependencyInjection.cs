using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SwiftCart.Cart.Domain.Repositories;
using SwiftCart.Cart.Infrastructure.Repositories;

namespace SwiftCart.Cart.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
            options.InstanceName = "SwiftCart_";
        });

        services.AddScoped<ICartRepository, RedisCartRepository>();

        return services;
    }
}