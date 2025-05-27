using SwiftCart.BuildingBlocks.Common.Middleware; // Make sure to use the middleware's namespace
using Microsoft.AspNetCore.Builder;

namespace SwiftCart.BuildingBlocks.Common.Extensions {
    /// <summary>
    /// Extension methods for IApplicationBuilder to add common middleware.
    /// </summary>
    public static class ApplicationBuilderExtensions {
        /// <summary>
        /// Adds the ServerTimeHeaderMiddleware to the application's request pipeline.
        /// </summary>
        /// <param name="app">The <see cref="IApplicationBuilder"/> instance.</param>
        /// <returns>The <see cref="IApplicationBuilder"/> instance.</returns>
        public static IApplicationBuilder UseServerTimeHeader(this IApplicationBuilder app) {
            // Use the custom middleware class
            return app.UseMiddleware<ServerTimeHeaderMiddleware>();
        }
    }
}