namespace TimeVerse.Application.DTOs.Exams;

public class UpdateExamRequest
{
    public string Title { get; set; } = string.Empty;

    public DateTime ExamDate { get; set; }

    public string? Location { get; set; }

    public string? Notes { get; set; }
}