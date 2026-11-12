namespace TimeVerse.Application.DTOs.Exams;

public class ExamResponse
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public DateTime ExamDate { get; set; }

    public string? Location { get; set; }

    public string? Notes { get; set; }
}