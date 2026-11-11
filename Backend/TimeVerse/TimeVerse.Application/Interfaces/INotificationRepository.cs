
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(int id, int studentId);

    Task<IEnumerable<Notification>> GetAllByStudentIdAsync(int studentId);

    Task<IEnumerable<Notification>> GetByStudentTaskIdAsync(
        int studentTaskId,
        int studentId);

    Task AddAsync(Notification notification);

    void Update(Notification notification);

    void Delete(Notification notification);
}
