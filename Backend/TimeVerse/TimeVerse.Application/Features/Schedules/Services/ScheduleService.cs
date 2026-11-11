
using TimeVerse.Application.DTOs.Schedules;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Features.Schedules.Services;

public class ScheduleService : IScheduleService
{
    private readonly IScheduleRepository _scheduleRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ScheduleService(
        IScheduleRepository scheduleRepository,
        ICourseRepository courseRepository,
        IUnitOfWork unitOfWork)
    {
        _scheduleRepository = scheduleRepository;
        _courseRepository = courseRepository;
        _unitOfWork = unitOfWork;
    }

    // Create a new schedule
    public async Task<ScheduleResponse> CreateAsync(
        int studentId,
        CreateScheduleRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(
            request.CourseId,
            studentId);

        if (course is null)
            throw new KeyNotFoundException("Course not found.");

        if (request.EndTime <= request.StartTime)
            throw new ArgumentException(
                "End time must be after start time.");

        var schedule = new Schedule
        {
            CourseId = request.CourseId,
            Title = request.Title,
            DayOfWeek = request.DayOfWeek,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Location = request.Location
        };

        await _scheduleRepository.AddAsync(schedule);

        await _unitOfWork.SaveChangesAsync();

        return new ScheduleResponse
        {
            Id = schedule.Id,
            CourseId = schedule.CourseId,
            Title = schedule.Title,
            DayOfWeek = schedule.DayOfWeek,
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime,
            Location = schedule.Location
        };
    }

    // Get all schedules belonging to a student
    public async Task<IEnumerable<ScheduleResponse>> GetAllAsync(
        int studentId)
    {
        var schedules = await _scheduleRepository
            .GetAllByStudentIdAsync(studentId);

        return schedules.Select(schedule => new ScheduleResponse
        {
            Id = schedule.Id,
            CourseId = schedule.CourseId,
            Title = schedule.Title,
            DayOfWeek = schedule.DayOfWeek,
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime,
            Location = schedule.Location
        });
    }

    // Get all schedules belonging to a specific course
    public async Task<IEnumerable<ScheduleResponse>> GetAllByCourseIdAsync(
        int courseId,
        int studentId)
    {
        var course = await _courseRepository.GetByIdAsync(
            courseId,
            studentId);

        if (course is null)
            throw new KeyNotFoundException("Course not found.");

        var schedules = await _scheduleRepository
            .GetAllByCourseIdAsync(courseId, studentId);

        return schedules.Select(schedule => new ScheduleResponse
        {
            Id = schedule.Id,
            CourseId = schedule.CourseId,
            Title = schedule.Title,
            DayOfWeek = schedule.DayOfWeek,
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime,
            Location = schedule.Location
        });
    }

    // Get a specific schedule
    public async Task<ScheduleResponse?> GetByIdAsync(
        int id,
        int studentId)
    {
        var schedule = await _scheduleRepository.GetByIdAsync(
            id,
            studentId);

        if (schedule is null)
            return null;

        return new ScheduleResponse
        {
            Id = schedule.Id,
            CourseId = schedule.CourseId,
            Title = schedule.Title,
            DayOfWeek = schedule.DayOfWeek,
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime,
            Location = schedule.Location
        };
    }

    // Update an existing schedule
    public async Task<bool> UpdateAsync(
        int id,
        int studentId,
        UpdateScheduleRequest request)
    {
        var schedule = await _scheduleRepository.GetByIdAsync(
            id,
            studentId);

        if (schedule is null)
            return false;

        if (request.EndTime <= request.StartTime)
            throw new ArgumentException(
                "End time must be after start time.");

        schedule.Title = request.Title;
        schedule.DayOfWeek = request.DayOfWeek;
        schedule.StartTime = request.StartTime;
        schedule.EndTime = request.EndTime;
        schedule.Location = request.Location;

        _scheduleRepository.Update(schedule);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    // Delete an existing schedule
    public async Task<bool> DeleteAsync(
        int id,
        int studentId)
    {
        var schedule = await _scheduleRepository.GetByIdAsync(
            id,
            studentId);

        if (schedule is null)
            return false;

        _scheduleRepository.Delete(schedule);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
