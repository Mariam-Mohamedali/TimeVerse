
using TimeVerse.Application.DTOs.Courses;

namespace TimeVerse.Application.Interfaces;

public interface ICourseService
{
    Task<CourseResponse> CreateAsync(
        int studentId,
        CreateCourseRequest request);

    Task<IEnumerable<CourseResponse>> GetAllAsync(int studentId);

    Task<CourseResponse?> GetByIdAsync(int id, int studentId);

    Task<bool> UpdateAsync(
        int id,
        int studentId,
        UpdateCourseRequest request);

    Task<bool> DeleteAsync(int id, int studentId);
}
