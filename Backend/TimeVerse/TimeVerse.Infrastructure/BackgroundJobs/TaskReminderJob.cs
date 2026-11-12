using Hangfire;
using TimeVerse.Application.Interfaces;

namespace TimeVerse.Infrastructure.BackgroundJobs;

public class TaskReminderJob
{
    private readonly ITaskReminderService _taskReminderService;

    public TaskReminderJob(
        ITaskReminderService taskReminderService)
    {
        _taskReminderService = taskReminderService;
    }

    [DisableConcurrentExecution(timeoutInSeconds: 60)]
    public async Task ExecuteAsync()
    {
        // Process Task Reminders
        await _taskReminderService.ProcessTaskRemindersAsync();

        // Process Exam Reminders
        await _taskReminderService.ProcessExamRemindersAsync();
    }
}