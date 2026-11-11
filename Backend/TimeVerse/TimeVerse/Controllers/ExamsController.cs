
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TimeVerse.Application.DTOs.Exams;
using TimeVerse.Application.Interfaces;

namespace TimeVerse.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ExamsController : ControllerBase
{
    private readonly IExamService _examService;

    public ExamsController(IExamService examService)
    {
        _examService = examService;
    }

    private int GetCurrentStudentId()
    {
        var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return int.TryParse(studentId, out var id) ? id : 0;
    }

    [HttpPost]
    public async Task<IActionResult> CreateExam(
        [FromBody] CreateExamRequest request)
    {
        var studentId = GetCurrentStudentId();

        var exam = await _examService.CreateAsync(studentId, request);

        return CreatedAtAction(
            nameof(GetExamById),
            new { id = exam.Id },
            exam);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllExams()
    {
        var studentId = GetCurrentStudentId();

        var exams = await _examService.GetAllAsync(studentId);

        return Ok(exams);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExamById(int id)
    {
        var studentId = GetCurrentStudentId();

        var exam = await _examService.GetByIdAsync(id, studentId);

        if (exam == null)
        {
            return NotFound();
        }

        return Ok(exam);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExam(
        int id,
        [FromBody] UpdateExamRequest request)
    {
        var studentId = GetCurrentStudentId();

        var updated = await _examService.UpdateAsync(
            id,
            studentId,
            request);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExam(int id)
    {
        var studentId = GetCurrentStudentId();

        var deleted = await _examService.DeleteAsync(id, studentId);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
