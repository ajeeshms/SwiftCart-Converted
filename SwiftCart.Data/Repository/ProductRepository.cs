using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SwiftCart.Models;

namespace SwiftCart.Data {
    public class ProductRepository : IProductRepository {
        private readonly SwiftCartDbContext _context;
        private readonly IMapper _mapper;

        public ProductRepository(SwiftCartDbContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        public List<ProductModel> Get(int page, int size) {
            var products = _context.Products
                .Where(p => p.ThumbNailPhoto != null)
                .OrderBy(p => Guid.NewGuid())
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();
            return _mapper.Map<List<ProductModel>>(products);
        }

        public List<ProductModel> Get(params int[] productIds) {
            if (productIds.Length == 0) return new List<ProductModel>();
            var products = _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToList();
            return _mapper.Map<List<ProductModel>>(products);
        }

        public bool Update(Product product) {
            var existing = _context.Products.Find(product.Id);
            if (existing == null) return false;
            existing.Name = product.Name;
            existing.ListPrice = product.ListPrice;
            return _context.SaveChanges() == 1;
        }
    }
}
