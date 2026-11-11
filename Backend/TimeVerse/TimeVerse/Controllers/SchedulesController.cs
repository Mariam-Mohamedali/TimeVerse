
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TimeVerse.Application.DTOs.Schedules;
using TimeVerse.Application.Interfaces;

namespace TimeVerse.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SchedulesController : ControllerBase
{
    private readonly IScheduleService _scheduleService;

    public SchedulesController(IScheduleService scheduleService)
    {
        _scheduleService = scheduleService;
    }

    // Get the current student's ID from JWT
    private int? GetCurrentStudentId()
    {
        var studentIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(studentIdClaim, out var studentId))
            return null;

        return studentId;
    }

    // POST: api/schedules
    [HttpPost]
    public async Task<IActionResult> CreateSchedule(
        [FromBody] CreateScheduleRequest request)
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var schedule = await _scheduleService.CreateAsync(
            studentId.Value,
            request);

        return CreatedAtAction(
            nameof(GetScheduleById),
            new { id = schedule.Id },
            schedule);
    }

    // GET: api/schedules
    [HttpGet]
    public async Task<IActionResult> GetAllSchedules()
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var schedules = await _scheduleService.GetAllAsync(
            studentId.Value);

        return Ok(schedules);
    }

    // GET: api/schedules/course/{courseId}
    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetSchedulesByCourse(int courseId)
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var schedules = await _scheduleService.GetAllByCourseIdAsync(
            courseId,
            studentId.Value);

        return Ok(schedules);
    }

    // GET: api/schedules/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetScheduleById(int id)
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var schedule = await _scheduleService.GetByIdAsync(
            id,
            studentId.Value);

        if (schedule is null)
            return NotFound();

        return Ok(schedule);
    }

    // PUT: api/schedules/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSchedule(
        int id,
        [FromBody] UpdateScheduleRequest request)
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var isUpdated = await _scheduleService.UpdateAsync(
            id,
            studentId.Value,
            request);

        if (!isUpdated)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/schedules/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSchedule(int id)
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var isDeleted = await _scheduleService.DeleteAsync(
            id,
            studentId.Value);

        if (!isDeleted)
            return NotFound();

        return NoContent();
    }
}
