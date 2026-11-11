using TimeVerse.Application.DTOs.Notifications;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Features.Notifications.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public NotificationService(
        INotificationRepository notificationRepository,
        IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<NotificationResponse> CreateAsync(
        int studentId,
        CreateNotificationRequest request)
    {
        var notification = new Notification
        {
            StudentId = studentId,
            Title = request.Title,
            Message = request.Message,
            ScheduledAt = request.ScheduledAt,
            SentAt = null,
            IsRead = false
        };

        await _notificationRepository.AddAsync(notification);

        await _unitOfWork.SaveChangesAsync();

        return MapToResponse(notification);
    }

    public async Task<IEnumerable<NotificationResponse>> GetAllAsync(
        int studentId)
    {
        var notifications =
            await _notificationRepository.GetAllByStudentIdAsync(studentId);

        return notifications.Select(MapToResponse);
    }

    public async Task<NotificationResponse?> GetByIdAsync(
        int id,
        int studentId)
    {
        var notification =
            await _notificationRepository.GetByIdAsync(id, studentId);

        if (notification == null)
            return null;

        return MapToResponse(notification);
    }

    public async Task<bool> UpdateAsync(
        int id,
        int studentId,
        UpdateNotificationRequest request)
    {
        var notification =
            await _notificationRepository.GetByIdAsync(id, studentId);

        if (notification == null)
            return false;

        notification.IsRead = request.IsRead;

        _notificationRepository.Update(notification);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id, int studentId)
    {
        var notification =
            await _notificationRepository.GetByIdAsync(id, studentId);

        if (notification == null)
            return false;

        _notificationRepository.Delete(notification);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    private static NotificationResponse MapToResponse(
        Notification notification)
    {
        return new NotificationResponse
        {
            Id = notification.Id,
            StudentTaskId = notification.StudentTaskId,
            ExamId = notification.ExamId,
            Title = notification.Title,
            Message = notification.Message,
            ScheduledAt = notification.ScheduledAt,
            SentAt = notification.SentAt,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
    }
}