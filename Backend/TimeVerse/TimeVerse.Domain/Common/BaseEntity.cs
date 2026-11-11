namespace TimeVerse.Domain.Common;

public abstract class BaseEntity // abstract class that can be inherited by other entities to provide common properties
                                 // and we will not make an object of this class directly, but we will inherit it in other entities like Student, Course, etc.
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}