
using Microsoft.EntityFrameworkCore;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;
using TimeVerse.Domain.Enums;
using TimeVerse.Infrastructure.Persistence;

namespace TimeVerse.Infrastructure.Persistence.Repositories;

public class StudentTaskRepository : IStudentTaskRepository
{
    private readonly ApplicationDbContext _context;

    public StudentTaskRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentTask?> GetByIdAsync(int id, int studentId)
    {
        return await _context.StudentTasks
            .FirstOrDefaultAsync(t =>
                t.Id == id &&
                t.Course.StudentId == studentId);
    }

    public async Task<IEnumerable<StudentTask>> GetAllByStudentIdAsync(
        int studentId)
    {
        return await _context.StudentTasks
            .Where(t => t.Course.StudentId == studentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<StudentTask>> GetTasksNeedingRemindersAsync(
    DateTime now,
    DateTime reminderWindowEnd)
    {
        return await _context.StudentTasks
            .AsNoTracking()
            .Include(t => t.Course)
            .Where(t =>
                t.DueDate > now &&
                t.DueDate <= reminderWindowEnd &&
                t.Status != StudentTaskStatus.Completed &&
                !_context.Notifications.Any(n =>
                    n.StudentTaskId == t.Id))
            .ToListAsync();
    }

    public async Task AddAsync(StudentTask studentTask)
    {
        await _context.StudentTasks.AddAsync(studentTask);
    }

    public void Update(StudentTask studentTask)
    {
        _context.StudentTasks.Update(studentTask);
    }

    public void Delete(StudentTask studentTask)
    {
        _context.StudentTasks.Remove(studentTask);
    }
}
