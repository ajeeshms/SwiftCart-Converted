// Program.cs for ApiGateway

using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Define a CORS policy name for the Gateway
string GatewayCorsPolicy = "GatewayCorsPolicy";

// 1. Add YARP services and load configuration
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// 2. Add CORS services for the Gateway
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: GatewayCorsPolicy,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5001") // React app's origin
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials(); // Important if your React app sends credentials (cookies, auth headers)
                      });
});

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});


// 3. Enable CORS middleware - THIS MUST COME BEFORE MapReverseProxy()
app.UseCors(GatewayCorsPolicy);

// 4. Add other middleware (routing, authN, authZ) if needed before YARP
// app.UseRouting(); // YARP handles routing, but if you have other local endpoints
// app.UseAuthentication();
// app.UseAuthorization();

// 5. Enable YARP
app.MapReverseProxy();

app.Run();