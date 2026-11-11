using TimeVerse.Application.DTOs.Exams;

namespace TimeVerse.Application.Interfaces;

public interface IExamService
{
    Task<ExamResponse> CreateAsync(int studentId, CreateExamRequest request);

    Task<IEnumerable<ExamResponse>> GetAllAsync(int studentId);

    Task<ExamResponse?> GetByIdAsync(int id, int studentId);

    Task<bool> UpdateAsync(int id, int studentId, UpdateExamRequest request);

    Task<bool> DeleteAsync(int id, int studentId);
}