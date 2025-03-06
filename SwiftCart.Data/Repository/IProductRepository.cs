using SwiftCart.Models;

namespace SwiftCart.Data {
    public interface IProductRepository {
        List<ProductModel> Get(int page, int size);
        List<ProductModel> Get(params int[] productIds);
        bool Update(Product product);
    }
}
