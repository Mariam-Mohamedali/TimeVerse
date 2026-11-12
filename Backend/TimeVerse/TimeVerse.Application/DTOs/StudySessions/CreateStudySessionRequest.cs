namespace TimeVerse.Application.DTOs.StudySessions;

public class CreateStudySessionRequest
{
    public int StudyPlanId { get; set; }

    public int? StudentTaskId { get; set; }

    public string Title { get; set; } = string.Empty;

    public DateTime SessionDate { get; set; }

    public int DurationMinutes { get; set; }
}