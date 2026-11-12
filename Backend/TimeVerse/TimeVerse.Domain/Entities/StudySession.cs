
using TimeVerse.Domain.Common;

namespace TimeVerse.Domain.Entities;

public class StudySession:BaseEntity
{

    public int StudyPlanId { get; set; }

    // Optional Foreign Key
    public int? StudentTaskId { get; set; }

    public string Title { get; set; } = string.Empty;

    public DateTime SessionDate { get; set; }

    public int DurationMinutes { get; set; }

    public bool IsCompleted { get; set; } = false;

    // Navigation Properties
    public StudyPlan StudyPlan { get; set; } = null!;

    public StudentTask? StudentTask { get; set; }
}
