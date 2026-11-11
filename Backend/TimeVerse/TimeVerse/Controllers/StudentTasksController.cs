
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TimeVerse.Application.DTOs.StudentTasks;
using TimeVerse.Application.Interfaces;

namespace TimeVerse.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class StudentTasksController : ControllerBase
{
    private readonly IStudentTaskService _studentTaskService;

    public StudentTasksController(
        IStudentTaskService studentTaskService)
    {
        _studentTaskService = studentTaskService;
    }

    private int GetStudentId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    // POST: api/StudentTasks
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateStudentTaskRequest request)
    {
        var studentId = GetStudentId();

        var result = await _studentTaskService.CreateAsync(
            studentId,
            request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result);
    }

    // GET: api/StudentTasks
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var studentId = GetStudentId();

        var result = await _studentTaskService.GetAllAsync(
            studentId);

        return Ok(result);
    }

    // GET: api/StudentTasks/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var studentId = GetStudentId();

        var result = await _studentTaskService.GetByIdAsync(
            id,
            studentId);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // PUT: api/StudentTasks/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateStudentTaskRequest request)
    {
        var studentId = GetStudentId();

        var result = await _studentTaskService.UpdateAsync(
            id,
            studentId,
            request);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE: api/StudentTasks/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var studentId = GetStudentId();

        var result = await _studentTaskService.DeleteAsync(
            id,
            studentId);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
