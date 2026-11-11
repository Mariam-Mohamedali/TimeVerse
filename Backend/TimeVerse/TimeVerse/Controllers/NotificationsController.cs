using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TimeVerse.Application.DTOs.Notifications;
using TimeVerse.Application.Interfaces;

namespace TimeVerse.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(
        INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    private int GetStudentId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    // POST: api/Notifications
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateNotificationRequest request)
    {
        var studentId = GetStudentId();

        var result = await _notificationService.CreateAsync(
            studentId, request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result);
    }

    // GET: api/Notifications
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var studentId = GetStudentId();

        var result = await _notificationService.GetAllAsync(studentId);

        return Ok(result);
    }

    // GET: api/Notifications/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var studentId = GetStudentId();

        var result = await _notificationService.GetByIdAsync(
            id, studentId);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    // PUT: api/Notifications/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateNotificationRequest request)
    {
        var studentId = GetStudentId();

        var result = await _notificationService.UpdateAsync(
            id, studentId, request);

        if (!result)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/Notifications/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var studentId = GetStudentId();

        var result = await _notificationService.DeleteAsync(
            id, studentId);

        if (!result)
            return NotFound();

        return NoContent();
    }
}