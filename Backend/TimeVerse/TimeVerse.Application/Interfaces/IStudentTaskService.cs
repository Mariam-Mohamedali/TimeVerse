using TimeVerse.Application.DTOs.StudentTasks;

namespace TimeVerse.Application.Interfaces;

public interface IStudentTaskService
{
    Task<StudentTaskResponse> CreateAsync(int studentId, CreateStudentTaskRequest request);

    Task<IEnumerable<StudentTaskResponse>> GetAllAsync(int studentId);

    Task<StudentTaskResponse?> GetByIdAsync(int id, int studentId);

    Task<bool> UpdateAsync(int id, int studentId, UpdateStudentTaskRequest request);

    Task<bool> DeleteAsync(int id, int studentId);
}