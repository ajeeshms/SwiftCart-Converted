using System;

namespace SwiftCart.Cart.Application.Commands {
    /// <summary>
    /// Command to add an item to a user's cart.
    /// Frontend sends only the minimum required information.
    /// </summary>
    public class AddItemCommand {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }

        // ProductName and UnitPrice are REMOVED.
        // The Cart Service will fetch these from the Product Service.
    }
}