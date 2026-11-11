namespace TimeVerse.Application.DTOs.StudyPlans;

public class CreateStudyPlanRequest
{
    public string Title { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
}