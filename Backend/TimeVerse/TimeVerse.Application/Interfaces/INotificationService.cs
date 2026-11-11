using TimeVerse.Application.DTOs.Notifications;

namespace TimeVerse.Application.Interfaces;

public interface INotificationService
{
    Task<NotificationResponse> CreateAsync(
        int studentId,
        CreateNotificationRequest request);

    Task<IEnumerable<NotificationResponse>> GetAllAsync(int studentId);

    Task<NotificationResponse?> GetByIdAsync(int id, int studentId);

    Task<bool> UpdateAsync(
        int id,
        int studentId,
        UpdateNotificationRequest request);

    Task<bool> DeleteAsync(int id, int studentId);
}