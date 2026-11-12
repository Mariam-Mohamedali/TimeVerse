
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface IStudentTaskRepository
{
    Task<StudentTask?> GetByIdAsync(int id, int studentId);

    Task<IEnumerable<StudentTask>> GetAllByStudentIdAsync(int studentId);

    Task<IEnumerable<StudentTask>> GetTasksNeedingRemindersAsync(
        DateTime now,
        DateTime reminderWindowEnd);

    Task AddAsync(StudentTask studentTask);

    void Update(StudentTask studentTask);

    void Delete(StudentTask studentTask);
}
