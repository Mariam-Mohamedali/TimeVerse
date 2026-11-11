using System;
using System.Collections.Generic;
using System.Text;
using TimeVerse.Application.DTOs.StudyPlans;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Features.StudyPlans.Services
{
    public class StudyPlanService : IStudyPlanService
    {
        private readonly IStudyPlanRepository _studyPlanRepository;
        private readonly IUnitOfWork _unitOfWork;

        public StudyPlanService(IStudyPlanRepository studyPlanRepository, IUnitOfWork unitOfWork)
        {
            _studyPlanRepository = studyPlanRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<StudyPlanResponse> CreateAsync(int studentId, CreateStudyPlanRequest request)
        {
            if(request.EndDate < request.StartDate)
            {
                throw new ArgumentException("End date cannot be earlier than start date.");
            }

            var studyPlan = new StudyPlan
            {
                StudentId= studentId,
                Title = request.Title,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };
            await _studyPlanRepository.AddAsync(studyPlan);
            await _unitOfWork.SaveChangesAsync();
            return new StudyPlanResponse
            {
                Id = studyPlan.Id,
                Title = studyPlan.Title,
                StartDate = studyPlan.StartDate,
                EndDate = studyPlan.EndDate,
                CreatedAt = studyPlan.CreatedAt,
            };
        }

        public async Task<IEnumerable<StudyPlanResponse>> GetAllAsync(int studentId)
        {
            var studyPlans = await _studyPlanRepository.GetAllByStudentIdAsync(studentId);
            return studyPlans.Select(sp => new StudyPlanResponse
            {
                Id = sp.Id,
                Title = sp.Title,
                StartDate = sp.StartDate,
                EndDate = sp.EndDate,
                CreatedAt = sp.CreatedAt,
            });
        }

        public async Task<StudyPlanResponse?> GetByIdAsync(int id, int studentId)
        {
            var studyPlan = await _studyPlanRepository.GetByIdAsync(id, studentId);
            if (studyPlan == null)
            {
                return null;
            }
            return new StudyPlanResponse
            {
                Id = studyPlan.Id,
                Title = studyPlan.Title,
                StartDate = studyPlan.StartDate,
                EndDate = studyPlan.EndDate,
                CreatedAt = studyPlan.CreatedAt,
            };
        }

        public async Task<bool> UpdateAsync(int id, int studentId, UpdateStudyPlanRequest request)
        {
            var studyPlan = await _studyPlanRepository.GetByIdAsync(id, studentId);
            if (studyPlan == null)
            {
                return false;
            }
            if(request.EndDate < request.StartDate)
            {
                throw new ArgumentException("End date cannot be earlier than start date.");
            }

            studyPlan.Title = request.Title;
            studyPlan.StartDate = request.StartDate;
            studyPlan.EndDate = request.EndDate;

             _studyPlanRepository.Update(studyPlan);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAsync(int id, int studentId)
        {
            var studyPlan = await _studyPlanRepository.GetByIdAsync(id, studentId);
            if (studyPlan == null)
            {
                return false;
            }

             _studyPlanRepository.Delete(studyPlan);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        
        
        
    }
}
