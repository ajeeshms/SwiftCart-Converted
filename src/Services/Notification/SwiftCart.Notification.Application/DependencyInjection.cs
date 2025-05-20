using Microsoft.Extensions.DependencyInjection;
using SwiftCart.Notification.Application.Interfaces;
using SwiftCart.Notification.Application.Services;
using System.Reflection;

namespace SwiftCart.Notification.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        services.AddScoped<INotificationService, NotificationService>();
        
        return services;
    }
}