using Microsoft.AspNetCore.Mvc;
using SwiftCart.Notification.Application.DTOs;
using SwiftCart.Notification.Application.Interfaces;

namespace SwiftCart.Notification.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpPost]
    public async Task<IActionResult> SendNotification(NotificationDto notification)
    {
        await _notificationService.SendNotificationAsync(notification);
        return Ok();
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetUserNotifications(Guid userId)
    {
        var notifications = await _notificationService.GetUserNotificationsAsync(userId);
        return Ok(notifications);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        await _notificationService.MarkAsReadAsync(id);
        return Ok();
    }
}