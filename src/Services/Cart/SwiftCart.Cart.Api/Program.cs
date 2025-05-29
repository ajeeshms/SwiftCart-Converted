using SwiftCart.BuildingBlocks;
using SwiftCart.Cart.Application;
using SwiftCart.Cart.Application.Interfaces;
using SwiftCart.Cart.Infrastructure;
using SwiftCart.Cart.Infrastructure.Clients;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// --- Add Product API Client configuration ---
// Configure the base address for the HttpClient from settings
var productApiUrl = builder.Configuration["ProductService:Url"];
if (string.IsNullOrEmpty(productApiUrl)) {
    throw new InvalidOperationException("ProductService:Url configuration is missing.");
}

builder.Services.AddHttpClient<IProductApiClient, ProductApiClient>(client => {
    client.BaseAddress = new Uri(productApiUrl);
});

// Configure Kestrel to use port 5006
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5006);
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();