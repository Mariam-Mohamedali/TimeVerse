
using TimeVerse.Domain.Common;

namespace TimeVerse.Domain.Entities;

public class Exam:BaseEntity
{

    public int CourseId { get; set; } // Foreign key property

    public string Title { get; set; } = string.Empty;

    public DateTime ExamDate { get; set; }

    public string? Location { get; set; }

    public string? Notes { get; set; }

    // Navigation Property
    public Course Course { get; set; } = null!;
}
