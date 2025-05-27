using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging; // Optional: for logging if needed
using System;
using System.Threading.Tasks;

namespace SwiftCart.BuildingBlocks.Common.Middleware {
    /// <summary>
    /// Middleware that adds a custom 'X-Server-Time' header to the response
    /// with the current server UTC timestamp in ISO 8601 format.
    /// </summary>
    public class ServerTimeHeaderMiddleware {
        private readonly RequestDelegate _next;
        private const string HeaderName = "X-Server-Time";
        public ServerTimeHeaderMiddleware(RequestDelegate next) {
            _next = next;
            // _logger = logger; // Assign logger
        }

        public async Task InvokeAsync(HttpContext context) {
            // Add the header BEFORE calling the next middleware in the pipeline.
            // This ensures the header is set before any downstream component potentially
            // starts writing the response body, which locks headers.
            // Use UtcNow to avoid timezone issues and "o" format for ISO 8601
            context.Response.Headers[HeaderName] = DateTime.UtcNow.ToString("o");

            // Optional logging:
            // _logger.LogDebug($"Added header {HeaderName}: {context.Response.Headers[HeaderName]} for path {context.Request.Path}");


            // Now, call the rest of the pipeline. The header is already set.
            await _next(context);

            // Logic after await _next() would be for inspecting the response *after* it's finished,
            // but you cannot modify headers or status code here without buffering.
            // For simple headers, setting before _next() is the correct approach.
        }
    }
}