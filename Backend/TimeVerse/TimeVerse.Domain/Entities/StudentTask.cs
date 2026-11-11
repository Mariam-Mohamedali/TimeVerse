
using TimeVerse.Domain.Common;
using TimeVerse.Domain.Enums;

namespace TimeVerse.Domain.Entities;

public class StudentTask:BaseEntity
{

    public int CourseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime DueDate { get; set; }

    public TaskPriority Priority { get; set; }

    public StudentTaskStatus Status { get; set; }
        = StudentTaskStatus.Pending;

    // Navigation Properties
    public Course Course { get; set; } = null!;

    public ICollection<StudySession> StudySessions { get; set; }
        = new List<StudySession>();
}
