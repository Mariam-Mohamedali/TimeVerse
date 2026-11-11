using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence.Configurations;

public class ExamConfiguration : IEntityTypeConfiguration<Exam>
{
    public void Configure(EntityTypeBuilder<Exam> builder)
    {
        // Exam properties
        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Location)
            .HasMaxLength(200);

        builder.Property(e => e.Notes)
            .HasMaxLength(1000);

        // Course - Exam relationship (One-to-Many)
        builder.HasOne(e => e.Course)
            .WithMany(c => c.Exams)
            .HasForeignKey(e => e.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}