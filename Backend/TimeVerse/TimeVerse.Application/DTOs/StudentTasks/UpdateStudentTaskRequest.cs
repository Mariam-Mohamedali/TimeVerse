using TimeVerse.Domain.Enums;

namespace TimeVerse.Application.DTOs.StudentTasks;

public class UpdateStudentTaskRequest
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime DueDate { get; set; }

    public TaskPriority Priority { get; set; }

    public StudentTaskStatus Status { get; set; }
}