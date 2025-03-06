using Microsoft.EntityFrameworkCore;
using SwiftCart.Models;

namespace SwiftCart.Data {
    public class SwiftCartDbContext : DbContext {
        public SwiftCartDbContext(DbContextOptions<SwiftCartDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
    }
}
