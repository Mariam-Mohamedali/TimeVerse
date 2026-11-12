using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TimeVerse.Application.Interfaces;
using TimeVerse.Application.Features.Authentication.Services;
using TimeVerse.Application.Features.Courses.Services;
using TimeVerse.Application.Features.Schedules.Services;
using TimeVerse.Application.Features.Exams.Services;
using TimeVerse.Application.Features.StudentTasks.Services;
using TimeVerse.Application.Features.StudyPlans.Services;
using TimeVerse.Application.Features.StudySessions.Services;
using TimeVerse.Application.Features.Notifications.Services;
using TimeVerse.Application.Features.TaskReminders.Services;

namespace TimeVerse.Application;

public static class DependencyInjection //static class we can use the method without creating an instance of the class
{
    public static IServiceCollection AddApplication( //extension method
        this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly( //bdl ma nsgl kul validator lwahdo
            typeof(DependencyInjection).Assembly);
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<IScheduleService, ScheduleService>();
        services.AddScoped<IExamService, ExamService>();
        services.AddScoped<IStudentTaskService, StudentTaskService>();
        services.AddScoped<IStudyPlanService, StudyPlanService>();
        services.AddScoped<IStudySessionService, StudySessionService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<ITaskReminderService, TaskReminderService>();
        return services;
    }
}
