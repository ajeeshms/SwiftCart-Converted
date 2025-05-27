using Microsoft.AspNetCore.Mvc;
using SwiftCart.Order.Application.DTOs;
using SwiftCart.Order.Application.Interfaces;
using SwiftCart.Order.Domain.Enums;
using System.Net.Mime; // Needed for MediaTypeNames
using System.Collections.Generic; // Needed for KeyNotFoundException

namespace SwiftCart.Order.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase {
    private readonly IOrderService _orderService;
    private readonly IInvoiceExportService _invoiceExportService; // <--- Inject the new service

    public OrdersController(IOrderService orderService, IInvoiceExportService invoiceExportService) // <--- Add to constructor
    {
        _orderService = orderService;
        _invoiceExportService = invoiceExportService; // <--- Assign the new service
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetById(Guid id) {
        try {
            var order = await _orderService.GetByIdAsync(id);
            return Ok(order);
        }
        catch (KeyNotFoundException) {
            return NotFound($"Order with ID {id} not found.");
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetByUserId(Guid userId) {
        var orders = await _orderService.GetByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(OrderDto orderDto) {
        var order = await _orderService.CreateOrderAsync(orderDto);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<OrderDto>> Update(Guid id, OrderDto orderDto) {
        if (id != orderDto.Id)
            return BadRequest("Order ID in path must match Order ID in body.");

        try {
            var order = await _orderService.UpdateOrderAsync(orderDto);
            return Ok(order);
        }
        catch (KeyNotFoundException) {
            return NotFound($"Order with ID {id} not found.");
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<OrderDto>> UpdateStatus(Guid id, [FromBody] OrderStatus status) {
        try {
            var order = await _orderService.UpdateOrderStatusAsync(id, status);
            return Ok(order);
        }
        catch (KeyNotFoundException) {
            return NotFound($"Order with ID {id} not found.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) {
        try {
            await _orderService.DeleteOrderAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException) {
            return NotFound($"Order with ID {id} not found.");
        }
    }

    // <--- Add the new endpoint for exporting invoice ---
    [HttpGet("{id}/invoice/excel")]
    [ProducesResponseType(typeof(byte[]), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportInvoiceExcel(Guid id) {
        try {
            var excelBytes = await _invoiceExportService.ExportOrderInvoiceAsync(id);

            // Set the content type for Excel (.xlsx) files
            string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            // Suggest a file name for download
            string fileName = $"Invoice_{id}.xlsx"; // You might want to use order number here

            return File(excelBytes, contentType, fileName);
        }
        catch (KeyNotFoundException) {
            return NotFound($"Order with ID {id} not found.");
        }
        catch (Exception ex) {
            // Log the exception
            // _logger.LogError(ex, "Error exporting invoice for order {OrderId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while generating the invoice.");
        }
    }
    // <--- End of new endpoint ---
}