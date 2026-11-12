using TimeVerse.Application.DTOs.StudySessions;

namespace TimeVerse.Application.Interfaces;

public interface IStudySessionService
{
    Task<StudySessionResponse> CreateAsync(
        int studentId,
        CreateStudySessionRequest request);

    Task<IEnumerable<StudySessionResponse>> GetAllAsync(int studentId);

    Task<StudySessionResponse?> GetByIdAsync(int id, int studentId);

    Task<bool> UpdateAsync(
        int id,
        int studentId,
        UpdateStudySessionRequest request);

    Task<bool> DeleteAsync(int id, int studentId);
}