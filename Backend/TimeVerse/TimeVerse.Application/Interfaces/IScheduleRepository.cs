
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface IScheduleRepository
{
    Task<Schedule?> GetByIdAsync(int id, int studentId);

    Task<IEnumerable<Schedule>> GetAllByStudentIdAsync(int studentId);

    Task<IEnumerable<Schedule>> GetAllByCourseIdAsync(
        int courseId,
        int studentId);

    Task AddAsync(Schedule schedule);

    void Update(Schedule schedule);

    void Delete(Schedule schedule);
}
