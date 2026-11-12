using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence.Configurations;

public class StudentTaskConfiguration : IEntityTypeConfiguration<StudentTask>
{
    public void Configure(EntityTypeBuilder<StudentTask> builder)
    {
        // StudentTask properties
        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(t => t.Description)
            .HasMaxLength(1000);

        // Course - StudentTask relationship (One-to-Many)
        builder.HasOne(t => t.Course)
            .WithMany(c => c.Tasks)
            .HasForeignKey(t => t.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}