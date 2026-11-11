using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence.Configurations;

public class ScheduleConfiguration : IEntityTypeConfiguration<Schedule>
{
    public void Configure(EntityTypeBuilder<Schedule> builder)
    {
        // Schedule properties
        builder.Property(s => s.Title)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.Location)
            .HasMaxLength(200);

        // Course - Schedule relationship (One-to-Many)
        builder.HasOne(s => s.Course)
            .WithMany(c => c.Schedules)
            .HasForeignKey(s => s.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}