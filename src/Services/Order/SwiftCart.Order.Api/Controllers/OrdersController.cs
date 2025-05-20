using Microsoft.AspNetCore.Mvc;
using SwiftCart.Order.Application.DTOs;
using SwiftCart.Order.Application.Interfaces;
using SwiftCart.Order.Domain.Enums;

namespace SwiftCart.Order.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetById(Guid id)
    {
        var order = await _orderService.GetByIdAsync(id);
        return Ok(order);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetByUserId(Guid userId)
    {
        var orders = await _orderService.GetByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(OrderDto orderDto)
    {
        var order = await _orderService.CreateOrderAsync(orderDto);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<OrderDto>> Update(Guid id, OrderDto orderDto)
    {
        if (id != orderDto.Id)
            return BadRequest();

        var order = await _orderService.UpdateOrderAsync(orderDto);
        return Ok(order);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<OrderDto>> UpdateStatus(Guid id, [FromBody] OrderStatus status)
    {
        var order = await _orderService.UpdateOrderStatusAsync(id, status);
        return Ok(order);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _orderService.DeleteOrderAsync(id);
        return NoContent();
    }
}