using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TimeVerse.Application.DTOs.StudyPlans;
using TimeVerse.Application.Interfaces;

namespace TimeVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudyPlansController : ControllerBase
    {
        private readonly IStudyPlanService _studyPlanService;

        public StudyPlansController(IStudyPlanService studyPlanService)
        {
            _studyPlanService = studyPlanService;
        }

        private int GetStudentId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStudyPlanRequest request)
        {
            var studentId = GetStudentId();
            var result = await _studyPlanService.CreateAsync(studentId, request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var studentId = GetStudentId();
            var result = await _studyPlanService.GetAllAsync(studentId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var studentId = GetStudentId();
            var result = await _studyPlanService.GetByIdAsync(id, studentId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateStudyPlanRequest request)
        {
            var studentId = GetStudentId();
            var result = await _studyPlanService.UpdateAsync(id, studentId, request);   
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var studentId = GetStudentId();
            var result = await _studyPlanService.DeleteAsync(id, studentId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
