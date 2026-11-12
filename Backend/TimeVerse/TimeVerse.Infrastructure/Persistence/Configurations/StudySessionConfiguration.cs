using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence.Configurations;

public class StudySessionConfiguration : IEntityTypeConfiguration<StudySession>
{
    public void Configure(EntityTypeBuilder<StudySession> builder)
    {
        // StudySession properties
        builder.Property(s => s.Title)
            .IsRequired()
            .HasMaxLength(150);

        // StudyPlan - StudySession relationship (One-to-Many)
        builder.HasOne(s => s.StudyPlan)
            .WithMany(p => p.StudySessions)
            .HasForeignKey(s => s.StudyPlanId)
            .OnDelete(DeleteBehavior.Cascade);

        // StudentTask - StudySession relationship (Optional One-to-Many)
        builder.HasOne(s => s.StudentTask)
            .WithMany(t => t.StudySessions)
            .HasForeignKey(s => s.StudentTaskId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.ClientSetNull);
    }
}