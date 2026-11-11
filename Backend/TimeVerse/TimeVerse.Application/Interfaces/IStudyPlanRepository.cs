using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface IStudyPlanRepository
{
    Task<StudyPlan?> GetByIdAsync(int id, int studentId);

    Task<IEnumerable<StudyPlan>> GetAllByStudentIdAsync(int studentId);

    Task AddAsync(StudyPlan studyPlan);

    void Update(StudyPlan studyPlan);

    void Delete(StudyPlan studyPlan);
}