namespace SwiftCart.Models {
    public class CartItemModel {
        public int ID { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Total => Price * Quantity;
        public string? ImageUrl { get; set; }
    }
}
