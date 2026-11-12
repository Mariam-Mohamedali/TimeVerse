using Microsoft.EntityFrameworkCore;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<StudySession> StudySessions { get; set; }
        public DbSet<StudentTask> StudentTasks { get; set; }
        public DbSet<StudyPlan> StudyPlans { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(ApplicationDbContext).Assembly);
        }
    }
}