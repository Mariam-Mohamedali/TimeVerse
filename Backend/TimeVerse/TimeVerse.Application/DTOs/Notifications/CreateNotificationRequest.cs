namespace TimeVerse.Application.DTOs.Notifications;

public class CreateNotificationRequest
{
    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public DateTime ScheduledAt { get; set; }
}