
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TimeVerse.Application.DTOs.Courses;
using TimeVerse.Application.Interfaces;

namespace TimeVerse.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    // Get the current student's ID from JWT
    private int? GetCurrentStudentId()
    {
        var studentIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(studentIdClaim, out var studentId))
            return null;

        return studentId;
    }

    // POST: api/courses
    [HttpPost]
    public async Task<IActionResult> CreateCourse(
        [FromBody] CreateCourseRequest request)
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var course = await _courseService.CreateAsync(
            studentId.Value,
            request);

        return CreatedAtAction(
            nameof(GetCourseById),
            new { id = course.Id },
            course);
    }

    // GET: api/courses
    [HttpGet]
    public async Task<IActionResult> GetAllCourses()
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var courses = await _courseService.GetAllAsync(studentId.Value);

        return Ok(courses);
    }

    // GET: api/courses/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourseById(int id)
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var course = await _courseService.GetByIdAsync(
            id,
            studentId.Value);

        if (course is null)
            return NotFound();

        return Ok(course);
    }

    // PUT: api/courses/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(
        int id,
        [FromBody] UpdateCourseRequest request)
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var isUpdated = await _courseService.UpdateAsync(
            id,
            studentId.Value,
            request);

        if (!isUpdated)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/courses/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var studentId = GetCurrentStudentId();

        if (studentId is null)
            return Unauthorized();

        var isDeleted = await _courseService.DeleteAsync(
            id,
            studentId.Value);

        if (!isDeleted)
            return NotFound();

        return NoContent();
    }
}
