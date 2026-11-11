using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        // Notification properties
        builder.Property(n => n.Title)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(n => n.Message)
            .IsRequired()
            .HasMaxLength(1000);

        // Student - Notification relationship
        builder.HasOne(n => n.Student)
            .WithMany(s => s.Notifications)
            .HasForeignKey(n => n.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        // StudentTask - Notification relationship
        builder.HasOne(n => n.StudentTask)
            .WithMany()
            .HasForeignKey(n => n.StudentTaskId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.NoAction);

        // Exam - Notification relationship
        builder.HasOne(n => n.Exam)
            .WithMany()
            .HasForeignKey(n => n.ExamId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.NoAction);

        // Prevent duplicate Task reminders
        builder.HasIndex(n => n.StudentTaskId)
            .IsUnique()
            .HasFilter("[StudentTaskId] IS NOT NULL");

        // Prevent duplicate Exam reminders
        builder.HasIndex(n => n.ExamId)
            .IsUnique()
            .HasFilter("[ExamId] IS NOT NULL");
    }
}