using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence.Repositories
{
    public class StudyPlanRepository : IStudyPlanRepository
    {
        private readonly ApplicationDbContext _context;
        public StudyPlanRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<StudyPlan?> GetByIdAsync(int id, int studentId)
        {
            return await _context.StudyPlans
                .Include(sp => sp.StudySessions)
                .FirstOrDefaultAsync(sp => sp.Id == id && sp.StudentId == studentId);
        }

        public async Task<IEnumerable<StudyPlan>> GetAllByStudentIdAsync(int studentId)
        {
            return await _context.StudyPlans
                .Include(sp => sp.StudySessions)
                .Where(sp => sp.StudentId == studentId)
                .ToListAsync();
        }
        public async Task AddAsync(StudyPlan studyPlan)
        {
            await _context.StudyPlans.AddAsync(studyPlan);
        }

        
        public void Update(StudyPlan studyPlan)
        {
            _context.StudyPlans.Update(studyPlan);
        }

        public void Delete(StudyPlan studyPlan)
        {
            _context.StudyPlans.Remove(studyPlan);
        }
    }

        
    }

