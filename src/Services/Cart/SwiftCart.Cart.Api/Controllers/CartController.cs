using Microsoft.AspNetCore.Mvc;
using SwiftCart.Cart.Application.Commands;
using SwiftCart.Cart.Application.DTOs;
using SwiftCart.Cart.Application.Interfaces;
using System.Threading.Tasks;

namespace SwiftCart.Cart.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<CartDto>> GetCart(Guid userId)
    {
        var cart = await _cartService.GetCartAsync(userId);
        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<ActionResult<CartDto>> AddItem(AddItemCommand command)
    {
        var cart = await _cartService.AddItemAsync(command);
        return Ok(cart);
    }

    [HttpPut("items")]
    public async Task<ActionResult<CartDto>> UpdateItemQuantity(UpdateItemQuantityCommand command)
    {
        var cart = await _cartService.UpdateItemQuantityAsync(command);
        return Ok(cart);
    }

    [HttpDelete("{cartId}/items/{itemId}")]
    public async Task<ActionResult<CartDto>> RemoveItem(Guid cartId, Guid itemId)
    {
        var command = new RemoveItemCommand(cartId, itemId);
        var cart = await _cartService.RemoveItemAsync(command);
        return Ok(cart);
    }

    [HttpDelete("{cartId}")]
    public async Task<IActionResult> ClearCart(Guid cartId)
    {
        await _cartService.ClearCartAsync(cartId);
        return NoContent();
    }
}