using TimeVerse.Domain.Common;

namespace TimeVerse.Domain.Entities;

public class Course:BaseEntity
{

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int StudentId { get; set; } // Foreign key property


    // Navigation Properties
    public Student Student { get; set; } = null!;

    public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();

    public ICollection<Exam> Exams { get; set; } = new List<Exam>();

    public ICollection<StudentTask> Tasks { get; set; } = new List<StudentTask>();
    
}