
using TimeVerse.Domain.Common;

namespace TimeVerse.Domain.Entities;

public class Schedule:BaseEntity
{

    public int CourseId { get; set; } // Foreign key property

    public string Title { get; set; } = string.Empty;

    public DayOfWeek DayOfWeek { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public string? Location { get; set; }

    // Navigation Property
    public Course Course { get; set; } = null!;
}
