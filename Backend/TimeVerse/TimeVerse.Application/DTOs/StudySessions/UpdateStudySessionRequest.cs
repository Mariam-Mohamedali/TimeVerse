namespace TimeVerse.Application.DTOs.StudySessions;

public class UpdateStudySessionRequest
{
    public int? StudentTaskId { get; set; }

    public string Title { get; set; } = string.Empty;

    public DateTime SessionDate { get; set; }

    public int DurationMinutes { get; set; }

    public bool IsCompleted { get; set; }
}