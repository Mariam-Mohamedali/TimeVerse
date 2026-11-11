using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TimeVerse.Application.DTOs.StudySessions;
using TimeVerse.Application.Interfaces;

namespace TimeVerse.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class StudySessionsController : ControllerBase
{
    private readonly IStudySessionService _studySessionService;

    public StudySessionsController(IStudySessionService studySessionService)
    {
        _studySessionService = studySessionService;
    }

    private int GetStudentId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    // POST: api/StudySessions
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateStudySessionRequest request)
    {
        var studentId = GetStudentId();

        var result = await _studySessionService.CreateAsync(
            studentId, request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result);
    }

    // GET: api/StudySessions
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var studentId = GetStudentId();

        var result = await _studySessionService.GetAllAsync(studentId);

        return Ok(result);
    }

    // GET: api/StudySessions/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var studentId = GetStudentId();

        var result = await _studySessionService.GetByIdAsync(
            id, studentId);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    // PUT: api/StudySessions/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateStudySessionRequest request)
    {
        var studentId = GetStudentId();

        var result = await _studySessionService.UpdateAsync(
            id, studentId, request);

        if (!result)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/StudySessions/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var studentId = GetStudentId();

        var result = await _studySessionService.DeleteAsync(
            id, studentId);

        if (!result)
            return NotFound();

        return NoContent();
    }
}