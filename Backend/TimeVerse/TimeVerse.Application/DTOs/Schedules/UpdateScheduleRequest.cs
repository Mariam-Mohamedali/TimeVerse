
namespace TimeVerse.Application.DTOs.Schedules;

public class UpdateScheduleRequest
{
    public string Title { get; set; } = string.Empty;

    public DayOfWeek DayOfWeek { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public string? Location { get; set; }
}
