using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence.Repositories;

public class StudySessionRepository : IStudySessionRepository
{
    private readonly ApplicationDbContext _context;
    public StudySessionRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<StudySession?> GetByIdAsync(int id, int studentId)
    {
        return await _context.StudySessions.FirstOrDefaultAsync(s => s.Id == id && s.StudyPlan.StudentId == studentId);
    }

    public async Task<IEnumerable<StudySession>> GetAllByStudentIdAsync(int studentId)
    {
        return await _context.StudySessions.Where(s => s.StudyPlan.StudentId == studentId).ToListAsync();
    }

    public async Task AddAsync(StudySession studySession)
    {
        await _context.StudySessions.AddAsync(studySession);
        await _context.SaveChangesAsync();
    }

    public void Update(StudySession studySession)
    {
        _context.StudySessions.Update(studySession);
    }

    

    public void Delete(StudySession studySession)
    {
        _context.StudySessions.Remove(studySession);
    }
}
