// filename: NET8 V8\src\SwiftCart\src\Services\Cart\SwiftCart.Cart.Application\Services\CartService.cs
using SwiftCart.Cart.Application.Commands;
using SwiftCart.Cart.Application.DTOs;
using SwiftCart.Cart.Application.Interfaces;
using SwiftCart.Cart.Domain.Entities; // Assuming Cart and CartItem entities are here
using System;
using System.Linq;
using System.Threading.Tasks;
using SwiftCart.Cart.Application.Exceptions; // Make sure this namespace exists and exceptions are defined here
using Microsoft.Extensions.Logging; // For logging
using System.Collections.Generic; // For List

namespace SwiftCart.Cart.Application.Services {
    // Assuming this class implements ICartService
    public class CartService : ICartService {
        private readonly Domain.Repositories.ICartRepository _cartRepository; // Assume injected repository
        private readonly IProductApiClient _productApiClient; // Inject the Product API client
        private readonly ILogger<CartService> _logger; // For logging

        public CartService(Domain.Repositories.ICartRepository cartRepository, IProductApiClient productApiClient, ILogger<CartService> logger) {
            _cartRepository = cartRepository;
            _productApiClient = productApiClient;
            _logger = logger;
        }

        // --- AddItemAsync (Provided Example) ---
        public async Task<CartDto> AddItemAsync(AddItemCommand command) {
            _logger.LogInformation("AddItemAsync received: UserId={UserId}, ProductId={ProductId}, Quantity={Quantity}",
                command.UserId, command.ProductId, command.Quantity);

            // 1. Validate initial quantity
            if (command.Quantity <= 0) {
                _logger.LogWarning("Attempted to add item with invalid quantity: {Quantity}", command.Quantity);
                throw new InvalidQuantityException("Quantity must be at least 1.");
            }

            // 2. Fetch product details from Product Service
            var product = await _productApiClient.GetProductByIdAsync(command.ProductId);

            if (product == null) {
                _logger.LogWarning("Product with ID {ProductId} not found by Product Service.", command.ProductId);
                // Throw a business-specific exception
                throw new ProductNotFoundException(command.ProductId);
            }

            _logger.LogDebug("Fetched product details: Name={ProductName}, Price={Price}, Stock={StockQuantity}",
                            product.Name, product.Price, product.StockQuantity);

            // 3. Get or create the user's cart
            var cart = await _cartRepository.GetByUserIdAsync(command.UserId);
            bool isNewCart = false;
            if (cart == null) {
                _logger.LogInformation("Creating new cart for user {UserId}.", command.UserId);
                cart = new Domain.Entities.Cart {
                    Id = Guid.NewGuid(),
                    UserId = command.UserId,
                    Items = new List<CartItem>(), // Ensure Items list is initialized
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true // Assuming new carts are active
                };
                isNewCart = true;
            }

            // 4. Find or add the item to the cart
            var existingItem = cart.Items.FirstOrDefault(item => item.ProductId == command.ProductId);

            if (existingItem == null) {
                _logger.LogInformation("Adding new item (Product ID {ProductId}) with quantity {Quantity} to cart {CartId}.", command.ProductId, command.Quantity, cart.Id);
                // 4a. Perform stock check for new item
                if (command.Quantity > product.StockQuantity) {
                    _logger.LogWarning("Insufficient stock for new item (Product ID {ProductId}). Requested: {Requested}, Available: {Available}",
                        command.ProductId, command.Quantity, product.StockQuantity);
                    throw new InsufficientStockException(product.Name, command.Quantity, product.StockQuantity);
                }

                // Add new item
                var newItem = new CartItem {
                    Id = Guid.NewGuid(),
                    CartId = cart.Id,
                    ProductId = command.ProductId,
                    ProductName = product.Name, // Use fetched name
                    UnitPrice = product.Price,   // Use fetched price
                    Quantity = command.Quantity,
                    CreatedAt = DateTime.UtcNow
                };
                cart.Items.Add(newItem);
            }
            else {
                _logger.LogInformation("Updating quantity for existing item (Item ID {ItemId}, Product ID {ProductId}) in cart {CartId}. Adding {Quantity}.", existingItem.Id, command.ProductId, cart.Id, command.Quantity);
                // Update existing item quantity
                int newQuantity = existingItem.Quantity + command.Quantity;

                // 4b. Perform stock check for cumulative quantity
                if (newQuantity > product.StockQuantity) // Also check <= 0 in case initial quantity is negative somehow - though handled by initial validation now
                {
                    _logger.LogWarning("Insufficient stock for existing item (Product ID {ProductId}). Cumulative Requested: {Requested}, Available: {Available}",
                        command.ProductId, newQuantity, product.StockQuantity);
                    // Throw InsufficientStockException but mention the new total quantity
                    throw new InsufficientStockException(product.Name, newQuantity, product.StockQuantity);
                }

                existingItem.Quantity = newQuantity;
                existingItem.UpdatedAt = DateTime.UtcNow;
            }

            // 5. Save the updated cart
            if (isNewCart) {
                await _cartRepository.CreateAsync(cart); // Example, adjust based on your repo
            }
            else {
                await _cartRepository.UpdateAsync(cart); // Example, adjust based on your repo
            }


            _logger.LogInformation("Cart {CartId} updated successfully for user {UserId}.", cart.Id, cart.UserId);

            // 6. Return the updated cart DTO
            return MapToCartDto(cart); // Assuming a mapping function exists
        }


        // --- GetCartAsync Implementation ---
        public async Task<CartDto> GetCartAsync(Guid userId) {
            _logger.LogInformation("GetCartAsync received for UserId={UserId}", userId);

            var cart = await _cartRepository.GetByUserIdAsync(userId);

            if (cart == null) {
                _logger.LogInformation("No cart found for user {UserId}. Returning empty cart DTO.", userId);
                // Return an empty cart DTO structure if no cart exists for the user
                return new CartDto {
                    Id = Guid.Empty, // Or Guid.NewGuid() if your DTO structure requires a non-empty ID for empty carts
                    UserId = userId,
                    Items = new List<CartItemDto>()
                };
                // Alternatively, if your API controller handles 404 specifically for no cart, you could return null
                // return null; // If controller maps null service response to 404
            }

            _logger.LogInformation("Cart {CartId} found for user {UserId}. Items count: {ItemCount}", cart.Id, userId, cart.Items.Count);

            // Map the entity to DTO
            return MapToCartDto(cart);
        }


        // --- UpdateItemQuantityAsync Implementation ---
        public async Task<CartDto> UpdateItemQuantityAsync(UpdateItemQuantityCommand command) {
            _logger.LogInformation("UpdateItemQuantityAsync received: CartId={CartId}, ItemId={ItemId}, Quantity={Quantity}",
                command.CartId, command.ItemId, command.Quantity);

            // 1. Validate command quantity
            if (command.Quantity <= 0) {
                _logger.LogWarning("Attempted to update item {ItemId} quantity to invalid value: {Quantity}", command.ItemId, command.Quantity);
                throw new InvalidQuantityException("Quantity must be at least 1.");
            }


            // 2. Get the cart
            var cart = await _cartRepository.GetByIdAsync(command.CartId);
            if (cart == null) {
                _logger.LogWarning("Cart with ID {CartId} not found for updating item {ItemId}.", command.CartId, command.ItemId);
                throw new CartNotFoundException(command.CartId);
            }

            // 3. Find the item in the cart
            var existingItem = cart.Items.FirstOrDefault(item => item.Id == command.ItemId);
            if (existingItem == null) {
                _logger.LogWarning("Cart item with ID {ItemId} not found in cart {CartId}.", command.ItemId, command.CartId);
                throw new CartItemNotFoundException(command.ItemId, command.CartId);
            }

            // 4. Fetch product details to check stock
            var product = await _productApiClient.GetProductByIdAsync(existingItem.ProductId);
            if (product == null) {
                _logger.LogWarning("Product with ID {ProductId} for cart item {ItemId} not found by Product Service during quantity update.", existingItem.ProductId, existingItem.Id);
                // Optionally remove the item if the product no longer exists, or throw? Throwing is safer for data integrity.
                throw new ProductNotFoundException(existingItem.ProductId);
            }

            _logger.LogDebug("Fetched product details for update: Name={ProductName}, Price={Price}, Stock={StockQuantity}",
                            product.Name, product.Price, product.StockQuantity);


            // 5. Perform stock check against the NEW quantity
            if (command.Quantity > product.StockQuantity) {
                _logger.LogWarning("Insufficient stock for item {ItemId} (Product ID {ProductId}). Requested cumulative quantity: {Requested}, Available: {Available}",
                    command.ItemId, existingItem.ProductId, command.Quantity, product.StockQuantity);
                throw new InsufficientStockException(product.Name, command.Quantity, product.StockQuantity);
            }


            // 6. Update the item quantity and timestamp
            existingItem.Quantity = command.Quantity;
            existingItem.UpdatedAt = DateTime.UtcNow;

            _logger.LogInformation("Item {ItemId} quantity updated to {Quantity} in cart {CartId}.", existingItem.Id, existingItem.Quantity, cart.Id);

            // 7. Save the updated cart
            await _cartRepository.UpdateAsync(cart); // Example, adjust based on your repo

            // 8. Return the updated cart DTO
            return MapToCartDto(cart);
        }


        // --- RemoveItemAsync Implementation ---
        public async Task<CartDto> RemoveItemAsync(RemoveItemCommand command) {
            _logger.LogInformation("RemoveItemAsync received: CartId={CartId}, ItemId={ItemId}",
                command.CartId, command.ItemId);

            // 1. Get the cart
            var cart = await _cartRepository.GetByIdAsync(command.CartId);
            if (cart == null) {
                _logger.LogWarning("Cart with ID {CartId} not found for removing item {ItemId}.", command.CartId, command.ItemId);
                throw new CartNotFoundException(command.CartId);
            }

            // 2. Find the item in the cart
            var existingItem = cart.Items.FirstOrDefault(item => item.Id == command.ItemId);
            if (existingItem == null) {
                _logger.LogWarning("Cart item with ID {ItemId} not found in cart {CartId}.", command.ItemId, command.CartId);
                throw new CartItemNotFoundException(command.ItemId, command.CartId);
            }

            // 3. Remove the item from the list
            // Use .Remove() on the List<CartItem>
            bool removed = cart.Items.Remove(existingItem);
            if (!removed) // Should not happen if existingItem was found, but good check
            {
                _logger.LogError("Failed to remove item {ItemId} from list in cart {CartId} unexpectedly.", command.ItemId, command.CartId);
                // Optionally throw an error or log more verbosely
            }

            _logger.LogInformation("Item {ItemId} removed from cart {CartId}.", command.ItemId, command.CartId);

            // 4. Save the updated cart
            await _cartRepository.UpdateAsync(cart); // Example, adjust based on your repo

            // 5. Return the updated cart DTO
            return MapToCartDto(cart);
        }


        // --- ClearCartAsync Implementation ---
        public async Task ClearCartAsync(Guid cartId) {
            _logger.LogInformation("ClearCartAsync received: CartId={CartId}", cartId);

            // 1. Get the cart
            var cart = await _cartRepository.GetByIdAsync(cartId);
            if (cart == null) {
                _logger.LogWarning("Cart with ID {CartId} not found for clearing.", cartId);
                // As per standard behavior, clearing a non-existent cart is often a no-op, not an error.
                // Depending on exact requirements, you could throw CartNotFoundException instead.
                return; // Do nothing if cart doesn't exist
            }

            // 2. Clear all items from the cart
            cart.Items.Clear();

            _logger.LogInformation("All items cleared from cart {CartId}.", cartId);

            // 3. Save the updated cart (with an empty items list)
            await _cartRepository.UpdateAsync(cart); // Example, adjust based on your repo

            // Optionally, if you want to delete the cart entity entirely:
            // await _cartRepository.DeleteAsync(cartId); // Example, adjust based on your repo
        }


        // --- Mapping Helper (Example) ---
        // This helper is crucial and needs to be correctly implemented
        private CartDto MapToCartDto(Domain.Entities.Cart cart) {
            if (cart == null) {
                _logger.LogWarning("Attempted to map a null Cart entity to CartDto.");
                // Handle this case - might return null or an empty default DTO
                return null; // Or throw an ArgumentNullException depending on design
            }

            var cartDto = new CartDto {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = cart.Items?.Select(item => new CartItemDto {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,
                    // TotalPrice is a calculated property in CartItemDto
                }).ToList() ?? new List<CartItemDto>(), // Ensure Items list is never null in DTO
                                                        // TotalAmount and TotalItems are calculated properties in CartDto
            };

            _logger.LogDebug("Mapped Cart entity {CartId} to CartDto.", cart.Id);
            return cartDto;
        }

        // --- Custom Exception Definitions (Can be in a separate file, e.g., Application/Exceptions) ---
        // It's often good practice to put custom exceptions in the Application layer
        // Ensure these are defined in your SwiftCart.Cart.Application.Exceptions namespace

        // Example: SwiftCart.Cart.Application.Exceptions.ProductNotFoundException.cs
        // (As provided in previous step's comments)
        // public class ProductNotFoundException : Exception { ... }

        // Example: SwiftCart.Cart.Application.Exceptions.InsufficientStockException.cs
        // (As provided in previous step's comments)
        // public class InsufficientStockException : Exception { ... }

        // Add Cart-specific exceptions
        public class CartNotFoundException : Exception {
            public Guid CartId { get; }
            public CartNotFoundException(Guid cartId)
                : base($"Cart with ID {cartId} not found.") {
                CartId = cartId;
            }
        }

        public class CartItemNotFoundException : Exception {
            public Guid ItemId { get; }
            public Guid CartId { get; }
            public CartItemNotFoundException(Guid itemId, Guid cartId)
                : base($"Cart item with ID {itemId} not found in cart {cartId}.") {
                ItemId = itemId;
                CartId = cartId;
            }
        }

        public class InvalidQuantityException : Exception {
            public InvalidQuantityException(string message) : base(message) { }
            public InvalidQuantityException(string message, Exception innerException) : base(message, innerException) { }
        }

        // Remember to add exception handling for these in your API Controller!
        // For example, CartNotFoundException and CartItemNotFoundException should map to 404 Not Found,
        // InsufficientStockException and InvalidQuantityException should map to 400 Bad Request.
    }
}