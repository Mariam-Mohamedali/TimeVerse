
using TimeVerse.Domain.Common;

namespace TimeVerse.Domain.Entities;

public class StudyPlan:BaseEntity
{

    public int StudentId { get; set; } // Foreign key property

    public string Title { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }


    // Navigation Properties
    public Student Student { get; set; } = null!;

    public ICollection<StudySession> StudySessions { get; set; }
        = new List<StudySession>();
}
