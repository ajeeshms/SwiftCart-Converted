namespace SwiftCart.Contracts.DTOs.Cart;

public class UpdateCartItemQuantityData
{
    public Guid CartId { get; set; }
    public Guid ItemId { get; set; }
    public int Quantity { get; set; }
}