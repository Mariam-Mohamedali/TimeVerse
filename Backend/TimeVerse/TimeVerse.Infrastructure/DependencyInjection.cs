
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TimeVerse.Application.Interfaces;
using TimeVerse.Infrastructure.Persistence;
using TimeVerse.Infrastructure.Persistence.Repositories;
using TimeVerse.Infrastructure.Persistence.UnitOfWork;
using TimeVerse.Infrastructure.Security;
using TimeVerse.Domain.Entities;
using Hangfire;

namespace TimeVerse.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database Configuration
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection")));

        // Unit Of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Repositories
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<IScheduleRepository, ScheduleRepository>();
        services.AddScoped<IExamRepository, ExamRepository>();
        services.AddScoped<IStudentTaskRepository, StudentTaskRepository>();
        services.AddScoped<IStudyPlanRepository, StudyPlanRepository>();
        services.AddScoped<IStudySessionRepository, StudySessionRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();

        // Password Hashing
        services.AddScoped<IPasswordHasher, PasswordHasherService>();

        services.AddScoped<
            Microsoft.AspNetCore.Identity.IPasswordHasher<Student>,
            Microsoft.AspNetCore.Identity.PasswordHasher<Student>>();

        // JWT Token
        services.AddScoped<ITokenService, TokenService>();

        // Hangfire Configuration
        services.AddHangfire(config =>
        {
            config
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(
                    configuration.GetConnectionString("DefaultConnection"));
        });

        // Hangfire Background Job Server
        services.AddHangfireServer();

        return services;
    }
}
