namespace SwiftCart.Contracts.DTOs.Cart;

public class AddCartItemData
{
    public Guid CartId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}