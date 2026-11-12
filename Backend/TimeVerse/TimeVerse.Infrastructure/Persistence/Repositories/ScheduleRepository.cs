
using Microsoft.EntityFrameworkCore;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;
using TimeVerse.Infrastructure.Persistence;

namespace TimeVerse.Infrastructure.Persistence.Repositories;

public class ScheduleRepository : IScheduleRepository
{
    private readonly ApplicationDbContext _context;

    public ScheduleRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    // Get a specific schedule belonging to the current student
    public async Task<Schedule?> GetByIdAsync(int id, int studentId)
    {
        return await _context.Schedules
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                s.Course.StudentId == studentId);
    }

    // Get all schedules belonging to a specific student
    public async Task<IEnumerable<Schedule>> GetAllByStudentIdAsync(int studentId)
    {
        return await _context.Schedules
            .Where(s => s.Course.StudentId == studentId)
            .ToListAsync();
    }

    // Get all schedules belonging to a specific course and student
    public async Task<IEnumerable<Schedule>> GetAllByCourseIdAsync(
        int courseId,
        int studentId)
    {
        return await _context.Schedules
            .Where(s =>
                s.CourseId == courseId &&
                s.Course.StudentId == studentId)
            .ToListAsync();
    }

    // Add a new schedule
    public async Task AddAsync(Schedule schedule)
    {
        await _context.Schedules.AddAsync(schedule);
    }

    // Update an existing schedule
    public void Update(Schedule schedule)
    {
        _context.Schedules.Update(schedule);
    }

    // Delete a schedule
    public void Delete(Schedule schedule)
    {
        _context.Schedules.Remove(schedule);
    }
}
