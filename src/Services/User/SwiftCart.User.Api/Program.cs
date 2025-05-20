using SwiftCart.BuildingBlocks;
using SwiftCart.BuildingBlocks.Auth;
using SwiftCart.User.Application;
using SwiftCart.User.Application.Interfaces;
using SwiftCart.User.Infrastructure;
using SwiftCart.User.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);

// Configure Kestrel to use port 5004
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5004);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();