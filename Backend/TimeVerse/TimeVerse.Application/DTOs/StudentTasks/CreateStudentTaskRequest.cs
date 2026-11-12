using TimeVerse.Domain.Enums;

namespace TimeVerse.Application.DTOs.StudentTasks;

public class CreateStudentTaskRequest
{
    public int CourseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime DueDate { get; set; }

    public TaskPriority Priority { get; set; }
}