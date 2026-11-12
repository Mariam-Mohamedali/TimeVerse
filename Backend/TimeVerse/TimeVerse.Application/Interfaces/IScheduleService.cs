
using TimeVerse.Application.DTOs.Schedules;

namespace TimeVerse.Application.Interfaces;

public interface IScheduleService
{
    Task<ScheduleResponse> CreateAsync(
        int studentId,
        CreateScheduleRequest request);

    Task<IEnumerable<ScheduleResponse>> GetAllAsync(int studentId);

    Task<IEnumerable<ScheduleResponse>> GetAllByCourseIdAsync(
        int courseId,
        int studentId);

    Task<ScheduleResponse?> GetByIdAsync(int id, int studentId);

    Task<bool> UpdateAsync(
        int id,
        int studentId,
        UpdateScheduleRequest request);

    Task<bool> DeleteAsync(int id, int studentId);
}
