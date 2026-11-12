namespace TimeVerse.Application.DTOs.StudyPlans;

public class StudyPlanResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public DateTime CreatedAt { get; set; }
}