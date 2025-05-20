using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using System;

namespace SwiftCart.BuildingBlocks.Logging;

public static class LoggingExtensions
{
    public static IHostBuilder UseCustomSerilog(this IHostBuilder builder, string applicationName)
    {
        return builder.UseSerilog((hostingContext, loggerConfiguration) =>
        {
            loggerConfiguration
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("System", LogEventLevel.Warning)
                .Enrich.WithProperty("ApplicationName", applicationName)
                .Enrich.WithProperty("Environment", hostingContext.HostingEnvironment.EnvironmentName)
                .Enrich.FromLogContext()
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] [{ApplicationName}] {Message:lj}{NewLine}{Exception}")
                .WriteTo.File(
                    path: $"logs/{applicationName}-.log",
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{ApplicationName}] {Message:lj}{NewLine}{Exception}");
        });
    }

    public static IServiceCollection AddCustomLogging(this IServiceCollection services, string applicationName)
    {
        services.AddLogging(builder =>
        {
            builder.ClearProviders();
            builder.AddConsole();
            builder.AddDebug();
        });

        return services;
    }
}