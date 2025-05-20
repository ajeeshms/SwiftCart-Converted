using SwiftCart.Notification.Application.DTOs;

namespace SwiftCart.Notification.Application.Interfaces;

public interface INotificationService
{
    Task SendNotificationAsync(NotificationDto notification);
    Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(Guid userId);
    Task MarkAsReadAsync(Guid notificationId);
}