
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface ICourseRepository
{
    Task<Course?> GetByIdAsync(int id, int studentId);

    Task<IEnumerable<Course>> GetAllByStudentIdAsync(int studentId);

    Task AddAsync(Course course);

    void Update(Course course);

    void Delete(Course course);
}
