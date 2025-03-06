using SwiftCart.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SwiftCart.Models.Profiles;
using SwiftCart.Integrations;
using NLog.Web;
using NLog.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddDbContext<SwiftCartDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(ProductProfile), typeof(CartItemProfile));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<NumericService>();
builder.Services.AddHttpClient();
builder.Services.AddLogging(logging => logging.AddNLog());

// Session for cart
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseSession();
app.Use(async (context, next) => {
    context.Response.Headers["X-Server-Time"] = DateTime.Now.ToString("o");
    await next();
});
app.UseAuthorization();
app.MapRazorPages();

app.Run();
