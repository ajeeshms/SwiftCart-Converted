namespace SwiftCart.Models {
    public class ProductModel {
        public int ID { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
    }
}
