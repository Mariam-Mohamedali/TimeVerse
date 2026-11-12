using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface IStudySessionRepository
{
    Task<StudySession?> GetByIdAsync(int id, int studentId);

    Task<IEnumerable<StudySession>> GetAllByStudentIdAsync(int studentId);

    Task AddAsync(StudySession studySession);

    void Update(StudySession studySession);

    void Delete(StudySession studySession);
}