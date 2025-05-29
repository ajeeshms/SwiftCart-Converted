// filename: NET8 V8\src\SwiftCart\src\Services\Cart\SwiftCart.Cart.Api\Controllers\CartController.cs
using Microsoft.AspNetCore.Mvc;
using SwiftCart.Cart.Application.Commands; // AddItemCommand definition needs to be updated
using SwiftCart.Cart.Application.DTOs;
using SwiftCart.Cart.Application.Interfaces;
using System.Threading.Tasks;

namespace SwiftCart.Cart.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase {
    private readonly ICartService _cartService;

    public CartController(ICartService cartService) {
        _cartService = cartService;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<CartDto>> GetCart(Guid userId) {
        var cart = await _cartService.GetCartAsync(userId);
        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<ActionResult<CartDto>> AddItem(AddItemCommand command) // command object now only needs UserId, ProductId, Quantity
    {
        // The cart service implementation (_cartService.AddItemAsync)
        // must now fetch product details (name, price) using command.ProductId
        // by calling the Product microservice.
        var cart = await _cartService.AddItemAsync(command);
        return Ok(cart);
    }

    [HttpPut("items")]
    public async Task<ActionResult<CartDto>> UpdateItemQuantity(UpdateItemQuantityCommand command) {
        var cart = await _cartService.UpdateItemQuantityAsync(command);
        return Ok(cart);
    }

    [HttpDelete("{cartId}/items/{itemId}")]
    public async Task<ActionResult<CartDto>> RemoveItem(Guid cartId, Guid itemId) {
        var command = new RemoveItemCommand(cartId, itemId);
        var cart = await _cartService.RemoveItemAsync(command);
        return Ok(cart);
    }

    [HttpDelete("{cartId}")]
    public async Task<IActionResult> ClearCart(Guid cartId) {
        await _cartService.ClearCartAsync(cartId);
        return NoContent();
    }
}