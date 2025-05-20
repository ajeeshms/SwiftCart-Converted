using SwiftCart.BuildingBlocks;
using SwiftCart.Notification.Application;
using SwiftCart.Notification.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Configure Kestrel to use port 5010
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5010);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();