using Microsoft.AspNetCore.Builder;

namespace SwiftCart.BuildingBlocks.ErrorHandling;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ExceptionHandlerMiddleware>();
    }
}