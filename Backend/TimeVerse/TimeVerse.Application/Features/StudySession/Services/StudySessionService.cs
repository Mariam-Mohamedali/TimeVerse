
using TimeVerse.Application.DTOs.StudySessions;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Features.StudySessions.Services;

public class StudySessionService : IStudySessionService
{
    private readonly IStudySessionRepository _studySessionRepository;
    private readonly IStudyPlanRepository _studyPlanRepository;
    private readonly IStudentTaskRepository _studentTaskRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StudySessionService(
        IStudySessionRepository studySessionRepository,
        IStudyPlanRepository studyPlanRepository,
        IStudentTaskRepository studentTaskRepository,
        IUnitOfWork unitOfWork)
    {
        _studySessionRepository = studySessionRepository;
        _studyPlanRepository = studyPlanRepository;
        _studentTaskRepository = studentTaskRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<StudySessionResponse> CreateAsync(
        int studentId,
        CreateStudySessionRequest request)
    {
        // Check if the StudyPlan exists and belongs to the student.
        var studyPlan = await _studyPlanRepository.GetByIdAsync(
            request.StudyPlanId,
            studentId);

        if (studyPlan == null)
        {
            throw new InvalidOperationException(
                "Study plan not found or does not belong to this student.");
        }

        // Validate the session date.
        if (request.SessionDate < studyPlan.StartDate ||
            request.SessionDate > studyPlan.EndDate)
        {
            throw new ArgumentException(
                "Session date must be within the study plan period.");
        }

        // Validate the session duration.
        if (request.DurationMinutes <= 0)
        {
            throw new ArgumentException(
                "Duration must be greater than zero.");
        }

        // Check the optional StudentTask.
        if (request.StudentTaskId.HasValue)
        {
            var studentTask = await _studentTaskRepository.GetByIdAsync(
                request.StudentTaskId.Value,
                studentId);

            if (studentTask == null)
            {
                throw new InvalidOperationException(
                    "Student task not found or does not belong to this student.");
            }
        }

        var studySession = new StudySession
        {
            StudyPlanId = request.StudyPlanId,
            StudentTaskId = request.StudentTaskId,
            Title = request.Title,
            SessionDate = request.SessionDate,
            DurationMinutes = request.DurationMinutes,
            IsCompleted = false
        };

        await _studySessionRepository.AddAsync(studySession);

        await _unitOfWork.SaveChangesAsync();

        return MapToResponse(studySession);
    }

    public async Task<IEnumerable<StudySessionResponse>> GetAllAsync(
        int studentId)
    {
        var sessions = await _studySessionRepository
            .GetAllByStudentIdAsync(studentId);

        return sessions.Select(MapToResponse);
    }

    public async Task<StudySessionResponse?> GetByIdAsync(
        int id,
        int studentId)
    {
        var studySession = await _studySessionRepository
            .GetByIdAsync(id, studentId);

        if (studySession == null)
        {
            return null;
        }

        return MapToResponse(studySession);
    }

    public async Task<bool> UpdateAsync(
        int id,
        int studentId,
        UpdateStudySessionRequest request)
    {
        var studySession = await _studySessionRepository.GetByIdAsync(
            id,
            studentId);

        if (studySession == null)
        {
            return false;
        }

        // Validate the session duration.
        if (request.DurationMinutes <= 0)
        {
            throw new ArgumentException(
                "Duration must be greater than zero.");
        }

        // Check if the updated session date is within the StudyPlan period.
        var studyPlan = await _studyPlanRepository.GetByIdAsync(
            studySession.StudyPlanId,
            studentId);

        if (studyPlan == null)
        {
            return false;
        }

        if (request.SessionDate < studyPlan.StartDate ||
            request.SessionDate > studyPlan.EndDate)
        {
            throw new ArgumentException(
                "Session date must be within the study plan period.");
        }

        // Check the optional StudentTask.
        if (request.StudentTaskId.HasValue)
        {
            var studentTask = await _studentTaskRepository.GetByIdAsync(
                request.StudentTaskId.Value,
                studentId);

            if (studentTask == null)
            {
                throw new InvalidOperationException(
                    "Student task not found or does not belong to this student.");
            }
        }

        studySession.StudentTaskId = request.StudentTaskId;
        studySession.Title = request.Title;
        studySession.SessionDate = request.SessionDate;
        studySession.DurationMinutes = request.DurationMinutes;
        studySession.IsCompleted = request.IsCompleted;

        _studySessionRepository.Update(studySession);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(
        int id,
        int studentId)
    {
        var studySession = await _studySessionRepository.GetByIdAsync(
            id,
            studentId);

        if (studySession == null)
        {
            return false;
        }

        _studySessionRepository.Delete(studySession);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    private static StudySessionResponse MapToResponse(
        StudySession studySession)
    {
        return new StudySessionResponse
        {
            Id = studySession.Id,
            StudyPlanId = studySession.StudyPlanId,
            StudentTaskId = studySession.StudentTaskId,
            Title = studySession.Title,
            SessionDate = studySession.SessionDate,
            DurationMinutes = studySession.DurationMinutes,
            IsCompleted = studySession.IsCompleted,
            CreatedAt = studySession.CreatedAt
        };
    }
}
