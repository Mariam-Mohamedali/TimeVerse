namespace TimeVerse.Application.DTOs.StudySessions;

public class StudySessionResponse
{
    public int Id { get; set; }

    public int StudyPlanId { get; set; }

    public int? StudentTaskId { get; set; }

    public string Title { get; set; } = string.Empty;

    public DateTime SessionDate { get; set; }

    public int DurationMinutes { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime CreatedAt { get; set; }
}