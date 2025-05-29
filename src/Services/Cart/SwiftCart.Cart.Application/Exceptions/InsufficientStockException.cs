// filename: NET8 V8\src\SwiftCart\src\Services\Cart\SwiftCart.Cart.Application\Exceptions\InsufficientStockException.cs
using System;

namespace SwiftCart.Cart.Application.Exceptions {
    /// <summary>
    /// Custom exception for when the requested quantity exceeds available stock.
    /// </summary>
    public class InsufficientStockException : Exception {
        public string ProductName { get; }
        public int RequestedQuantity { get; } // The quantity the user *tried* to add or update to
        public int AvailableStock { get; }

        public InsufficientStockException(string productName, int requestedQuantity, int availableStock)
             : base($"Insufficient stock for '{productName}'. Requested: {requestedQuantity}, Available: {availableStock}.") {
            ProductName = productName;
            RequestedQuantity = requestedQuantity;
            AvailableStock = availableStock;
        }

        public InsufficientStockException(string productName, int requestedQuantity, int availableStock, string message)
             : base(message) {
            ProductName = productName;
            RequestedQuantity = requestedQuantity;
            AvailableStock = availableStock;
        }

        public InsufficientStockException(string productName, int requestedQuantity, int availableStock, string message, Exception innerException)
            : base(message, innerException) {
            ProductName = productName;
            RequestedQuantity = requestedQuantity;
            AvailableStock = availableStock;
        }

        // Consider adding constructors for serialization if needed in distributed scenarios
        // protected InsufficientStockException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}