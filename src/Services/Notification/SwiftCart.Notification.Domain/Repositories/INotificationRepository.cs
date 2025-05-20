using SwiftCart.Notification.Domain.Entities;

namespace SwiftCart.Notification.Domain.Repositories;

public interface INotificationRepository
{
    Task<Notification> GetByIdAsync(Guid id);
    Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId);
    Task<Notification> CreateAsync(Notification notification);
    Task<Notification> UpdateAsync(Notification notification);
    Task DeleteAsync(Guid id);
}