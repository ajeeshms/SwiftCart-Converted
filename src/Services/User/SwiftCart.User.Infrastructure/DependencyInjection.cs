using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SwiftCart.User.Application.Interfaces;
using SwiftCart.User.Domain.Repositories;
using SwiftCart.User.Infrastructure.Data;
using SwiftCart.User.Infrastructure.Repositories;
using SwiftCart.User.Infrastructure.Services;

namespace SwiftCart.User.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<UserDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();

        return services;
    }
}