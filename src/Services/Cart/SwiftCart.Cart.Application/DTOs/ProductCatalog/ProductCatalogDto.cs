using System;

namespace SwiftCart.Cart.Application.DTOs.ProductCatalog // Putting in a subfolder for clarity
{
    /// <summary>
    /// DTO to represent product data fetched from the Product Service.
    /// Only includes fields needed by the Cart Service.
    /// </summary>
    public class ProductCatalogDto {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        // We don't need description, category, imageUrl, dates, IsActive here.
    }
}