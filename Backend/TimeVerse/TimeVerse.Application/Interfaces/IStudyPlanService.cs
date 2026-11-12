using TimeVerse.Application.DTOs.StudyPlans;

namespace TimeVerse.Application.Interfaces;

public interface IStudyPlanService
{
    Task<StudyPlanResponse> CreateAsync(int studentId, CreateStudyPlanRequest request);

    Task<IEnumerable<StudyPlanResponse>> GetAllAsync(int studentId);

    Task<StudyPlanResponse?> GetByIdAsync(int id, int studentId);

    Task<bool> UpdateAsync(int id, int studentId, UpdateStudyPlanRequest request);

    Task<bool> DeleteAsync(int id, int studentId);
}