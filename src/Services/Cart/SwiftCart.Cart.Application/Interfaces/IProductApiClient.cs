// filename: NET8 V8\src\SwiftCart\src\Services\Cart\SwiftCart.Cart.Application\Interfaces\IProductApiClient.cs
using SwiftCart.Cart.Application.DTOs.ProductCatalog;
using System;
using System.Threading.Tasks;

namespace SwiftCart.Cart.Application.Interfaces {
    /// <summary>
    /// Interface for a client to interact with the Product Service.
    /// </summary>
    public interface IProductApiClient {
        /// <summary>
        /// Gets product details by ID from the Product Service.
        /// </summary>
        /// <param name="productId">The ID of the product.</param>
        /// <returns>A <see cref="ProductCatalogDto"/> if found, otherwise null.</returns>
        Task<ProductCatalogDto?> GetProductByIdAsync(Guid productId);
    }
}