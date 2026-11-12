
namespace TimeVerse.Application.DTOs.Courses;

public class CreateCourseRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}
