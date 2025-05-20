namespace SwiftCart.Contracts.DTOs.Cart;

public class CartData
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public List<CartItemData> Items { get; set; } = new();
    public decimal TotalAmount => Items.Sum(item => item.TotalPrice);
    public int TotalItems => Items.Sum(item => item.Quantity);
}