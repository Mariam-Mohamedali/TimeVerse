namespace TimeVerse.Application.Interfaces;

public interface ITaskReminderService
{
    Task ProcessTaskRemindersAsync();

    Task ProcessExamRemindersAsync();
}