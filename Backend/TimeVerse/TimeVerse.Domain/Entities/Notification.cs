using TimeVerse.Domain.Common;

namespace TimeVerse.Domain.Entities;

public class Notification : BaseEntity
{
    public int StudentId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public DateTime ScheduledAt { get; set; }

    public DateTime? SentAt { get; set; }

    public bool IsRead { get; set; } = false;

    public int? StudentTaskId { get; set; }

    public int? ExamId { get; set; }

    // Navigation Properties
    public Student Student { get; set; } = null!;

    public StudentTask? StudentTask { get; set; }

    public Exam? Exam { get; set; }
}