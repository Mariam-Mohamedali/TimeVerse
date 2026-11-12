using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface IExamRepository
{
    Task<Exam?> GetByIdAsync(int id, int studentId);

    Task<IEnumerable<Exam>> GetAllByStudentIdAsync(int studentId);

    Task<IEnumerable<Exam>> GetExamsNeedingRemindersAsync(
        DateTime now,
        DateTime reminderWindowEnd);

    Task AddAsync(Exam exam);

    void Update(Exam exam);

    void Delete(Exam exam);
}