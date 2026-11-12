using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence.Configurations;

public class StudyPlanConfiguration : IEntityTypeConfiguration<StudyPlan>
{
    public void Configure(EntityTypeBuilder<StudyPlan> builder)
    {
        // StudyPlan properties
        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(150);

        // Student - StudyPlan relationship (One-to-Many)
        builder.HasOne(p => p.Student)
            .WithMany(s => s.StudyPlans)
            .HasForeignKey(p => p.StudentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}