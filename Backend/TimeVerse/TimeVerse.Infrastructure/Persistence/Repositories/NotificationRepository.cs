using Microsoft.EntityFrameworkCore;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;
using TimeVerse.Infrastructure.Persistence;

namespace TimeVerse.Infrastructure.Persistence.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly ApplicationDbContext _context;

    public NotificationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Notification?> GetByIdAsync(int id, int studentId)
    {
        return await _context.Notifications
            .FirstOrDefaultAsync(n =>
                n.Id == id &&
                n.StudentId == studentId);
    }

    public async Task<IEnumerable<Notification>> GetAllByStudentIdAsync(int studentId)
    {
        return await _context.Notifications
            .Where(n => n.StudentId == studentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetByStudentTaskIdAsync(int studentTaskId, int studentId)
    {
        return await _context.Notifications
            .Where(n => n.StudentTaskId == studentTaskId && n.StudentId == studentId)
            .ToListAsync();
    }

    public async Task AddAsync(Notification notification)
    {
        await _context.Notifications.AddAsync(notification);
    }

    public void Update(Notification notification)
    {
        _context.Notifications.Update(notification);
    }

    public void Delete(Notification notification)
    {
        _context.Notifications.Remove(notification);
    }
}