using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Persistence.Configurations;

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        // Course properties
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Description)
            .HasMaxLength(500);

        // Student - Course relationship (One-to-Many)
        builder.HasOne(c => c.Student)
            .WithMany(s => s.Courses)
            .HasForeignKey(c => c.StudentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}