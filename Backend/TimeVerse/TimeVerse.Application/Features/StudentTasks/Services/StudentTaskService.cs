
using TimeVerse.Application.DTOs.StudentTasks;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;
using TimeVerse.Domain.Enums;

namespace TimeVerse.Application.Features.StudentTasks.Services;

public class StudentTaskService : IStudentTaskService
{
    private readonly IStudentTaskRepository _studentTaskRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StudentTaskService(
        IStudentTaskRepository studentTaskRepository,
        ICourseRepository courseRepository,
        INotificationRepository notificationRepository,
        IUnitOfWork unitOfWork)
    {
        _studentTaskRepository = studentTaskRepository;
        _courseRepository = courseRepository;
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<StudentTaskResponse> CreateAsync(
        int studentId,
        CreateStudentTaskRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(
            request.CourseId,
            studentId);

        if (course == null)
        {
            throw new InvalidOperationException(
                "Course not found or does not belong to this student.");
        }

        var studentTask = new StudentTask
        {
            CourseId = request.CourseId,
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
            Priority = request.Priority,
            Status = StudentTaskStatus.Pending
        };

        await _studentTaskRepository.AddAsync(studentTask);

        await _unitOfWork.SaveChangesAsync();

        return new StudentTaskResponse
        {
            Id = studentTask.Id,
            CourseId = studentTask.CourseId,
            Title = studentTask.Title,
            Description = studentTask.Description,
            DueDate = studentTask.DueDate,
            Priority = studentTask.Priority,
            Status = studentTask.Status,
            CreatedAt = studentTask.CreatedAt
        };
    }

    public async Task<IEnumerable<StudentTaskResponse>> GetAllAsync(
        int studentId)
    {
        var tasks = await _studentTaskRepository
            .GetAllByStudentIdAsync(studentId);

        return tasks.Select(t => new StudentTaskResponse
        {
            Id = t.Id,
            CourseId = t.CourseId,
            Title = t.Title,
            Description = t.Description,
            DueDate = t.DueDate,
            Priority = t.Priority,
            Status = t.Status,
            CreatedAt = t.CreatedAt
        });
    }

    public async Task<StudentTaskResponse?> GetByIdAsync(
        int id,
        int studentId)
    {
        var studentTask = await _studentTaskRepository
            .GetByIdAsync(id, studentId);

        if (studentTask == null)
        {
            return null;
        }

        return new StudentTaskResponse
        {
            Id = studentTask.Id,
            CourseId = studentTask.CourseId,
            Title = studentTask.Title,
            Description = studentTask.Description,
            DueDate = studentTask.DueDate,
            Priority = studentTask.Priority,
            Status = studentTask.Status,
            CreatedAt = studentTask.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(
        int id,
        int studentId,
        UpdateStudentTaskRequest request)
    {
        var studentTask = await _studentTaskRepository
            .GetByIdAsync(id, studentId);

        if (studentTask == null)
        {
            return false;
        }

        studentTask.Title = request.Title;
        studentTask.Description = request.Description;
        studentTask.DueDate = request.DueDate;
        studentTask.Priority = request.Priority;
        studentTask.Status = request.Status;

        _studentTaskRepository.Update(studentTask);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id, int studentId)
    {
        var studentTask = await _studentTaskRepository
            .GetByIdAsync(id, studentId);

        if (studentTask == null)
        {
            return false;
        }

        // Get notifications related to this task
        var notifications = await _notificationRepository
            .GetByStudentTaskIdAsync(id, studentId);

        // Unlink notifications from the task
        foreach (var notification in notifications)
        {
            notification.StudentTaskId = null;

            _notificationRepository.Update(notification);
        }

        // Delete the task
        _studentTaskRepository.Delete(studentTask);

        // Save all changes
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
