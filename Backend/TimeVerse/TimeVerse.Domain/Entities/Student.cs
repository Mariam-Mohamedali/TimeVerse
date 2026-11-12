using TimeVerse.Domain.Common;

namespace TimeVerse.Domain.Entities;

public class Student:BaseEntity
{

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;


    // Navigation Properties
    public ICollection<Course> Courses { get; set; } = new List<Course>();

    public ICollection<StudyPlan> StudyPlans { get; set; } = new List<StudyPlan>();

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}