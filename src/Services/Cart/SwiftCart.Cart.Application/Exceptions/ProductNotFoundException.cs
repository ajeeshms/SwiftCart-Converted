// filename: NET8 V8\src\SwiftCart\src\Services\Cart\SwiftCart.Cart.Application\Exceptions\ProductNotFoundException.cs
using System;

namespace SwiftCart.Cart.Application.Exceptions {
    /// <summary>
    /// Custom exception for when a product is not found in the Product Service catalog.
    /// </summary>
    public class ProductNotFoundException : Exception {
        public Guid ProductId { get; }

        public ProductNotFoundException(Guid productId)
            : base($"Product with ID {productId} not found in the product catalog.") {
            ProductId = productId;
        }

        public ProductNotFoundException(Guid productId, string message)
            : base(message) {
            ProductId = productId;
        }

        public ProductNotFoundException(Guid productId, string message, Exception innerException)
            : base(message, innerException) {
            ProductId = productId;
        }

        // Consider adding constructors for serialization if needed in distributed scenarios
        // protected ProductNotFoundException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}