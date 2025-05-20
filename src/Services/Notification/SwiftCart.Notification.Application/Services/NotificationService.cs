using SwiftCart.Notification.Application.DTOs;
using SwiftCart.Notification.Application.Interfaces;

namespace SwiftCart.Notification.Application.Services;

public class NotificationService : INotificationService
{
    public async Task SendNotificationAsync(NotificationDto notification)
    {
        // Implementation will be added later
        await Task.CompletedTask;
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(Guid userId)
    {
        // Implementation will be added later
        return await Task.FromResult(new List<NotificationDto>());
    }

    public async Task MarkAsReadAsync(Guid notificationId)
    {
        // Implementation will be added later
        await Task.CompletedTask;
    }
}