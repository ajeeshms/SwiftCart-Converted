using Microsoft.EntityFrameworkCore;
using SwiftCart.Order.Domain.Entities;

namespace SwiftCart.Order.Infrastructure.Data;

public class OrderDbContext : DbContext
{
    public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options)
    {
    }

    public DbSet<Domain.Entities.Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Domain.Entities.Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OrderNumber).IsRequired();
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            entity.OwnsOne(e => e.ShippingAddress);
            entity.OwnsOne(e => e.BillingAddress);
            entity.OwnsOne(e => e.PaymentInfo);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
        });

        base.OnModelCreating(modelBuilder);
    }
}