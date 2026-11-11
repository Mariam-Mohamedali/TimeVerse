using Microsoft.EntityFrameworkCore;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;
using TimeVerse.Infrastructure.Persistence;

namespace TimeVerse.Infrastructure.Persistence.Repositories;

public class ExamRepository : IExamRepository
{
    private readonly ApplicationDbContext _context;

    public ExamRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Exam?> GetByIdAsync(int id, int studentId)
    {
        return await _context.Exams
            .FirstOrDefaultAsync(e =>
                e.Id == id &&
                e.Course.StudentId == studentId);
    }

    public async Task<IEnumerable<Exam>> GetAllByStudentIdAsync(int studentId)
    {
        return await _context.Exams
            .Where(e => e.Course.StudentId == studentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Exam>> GetExamsNeedingRemindersAsync(
        DateTime now,
        DateTime reminderWindowEnd)
    {
        return await _context.Exams
            .AsNoTracking()
            .Include(e => e.Course)
            .Where(e =>
                e.ExamDate > now &&
                e.ExamDate <= reminderWindowEnd &&
                !_context.Notifications.Any(n =>
                    n.ExamId == e.Id))
            .ToListAsync();
    }

    public async Task AddAsync(Exam exam)
    {
        await _context.Exams.AddAsync(exam);
    }

    public void Update(Exam exam)
    {
        _context.Exams.Update(exam);
    }

    public void Delete(Exam exam)
    {
        _context.Exams.Remove(exam);
    }
}