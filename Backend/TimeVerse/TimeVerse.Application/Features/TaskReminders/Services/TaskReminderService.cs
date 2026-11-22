using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Features.TaskReminders.Services;

public class TaskReminderService : ITaskReminderService
{
    private readonly IStudentTaskRepository _studentTaskRepository;
    private readonly IExamRepository _examRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TaskReminderService(
        IStudentTaskRepository studentTaskRepository,
        IExamRepository examRepository,
        INotificationRepository notificationRepository,
        IUnitOfWork unitOfWork)
    {
        _studentTaskRepository = studentTaskRepository;
        _examRepository = examRepository;
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    // Process Task Reminders
    public async Task ProcessTaskRemindersAsync()
    {
        var now = DateTime.UtcNow;
        var reminderWindowEnd = now.AddHours(24);

        var tasks = await _studentTaskRepository
            .GetTasksNeedingRemindersAsync(now, reminderWindowEnd);

        foreach (var task in tasks)
        {
            var notification = new Notification
            {
                StudentId = task.Course.StudentId,
                StudentTaskId = task.Id,

                Title = "Task Deadline Reminder",

                Message = $"Your task '{task.Title}' is due on " +
                          $"{task.DueDate:yyyy-MM-dd HH:mm}.",

                ScheduledAt = task.DueDate.AddHours(-24),
                SentAt = now,
                IsRead = false
            };

            await _notificationRepository.AddAsync(notification);
        }

        if (tasks.Any())
        {
            await _unitOfWork.SaveChangesAsync();
        }
    }

    // Process Exam Reminders
    public async Task ProcessExamRemindersAsync()
    {
        var now = DateTime.UtcNow;
        var reminderWindowEnd = now.AddHours(24);

        var exams = await _examRepository
            .GetExamsNeedingRemindersAsync(now, reminderWindowEnd);

        foreach (var exam in exams)
        {
            var isFinalExam = exam.Title.Contains(
                "final",
                StringComparison.OrdinalIgnoreCase);

            var notification = new Notification
            {
                StudentId = exam.Course.StudentId,
                ExamId = exam.Id,

                Title = isFinalExam ? "Final Exam Reminder" : "Exam Reminder",

                Message = $"Your {(isFinalExam ? "final exam" : "exam")} " +
                          $"'{exam.Title}' is scheduled for " +
                          $"{exam.ExamDate:yyyy-MM-dd HH:mm}.",

                ScheduledAt = exam.ExamDate.AddHours(-24),
                SentAt = now,
                IsRead = false
            };

            await _notificationRepository.AddAsync(notification);
        }

        if (exams.Any())
        {
            await _unitOfWork.SaveChangesAsync();
        }
    }
}