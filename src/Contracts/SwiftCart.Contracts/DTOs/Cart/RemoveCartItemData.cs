namespace SwiftCart.Contracts.DTOs.Cart;

public class RemoveCartItemData
{
    public Guid CartId { get; set; }
    public Guid ItemId { get; set; }
}