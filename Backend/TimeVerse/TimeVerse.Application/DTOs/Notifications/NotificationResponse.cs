namespace TimeVerse.Application.DTOs.Notifications;

public class NotificationResponse
{
    public int Id { get; set; }

    public int? StudentTaskId { get; set; }

    public int? ExamId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public DateTime ScheduledAt { get; set; }

    public DateTime? SentAt { get; set; }

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }
}