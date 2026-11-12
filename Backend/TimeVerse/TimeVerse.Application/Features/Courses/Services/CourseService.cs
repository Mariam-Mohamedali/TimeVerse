
using TimeVerse.Application.DTOs.Courses;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Features.Courses.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CourseService(
        ICourseRepository courseRepository,
        IUnitOfWork unitOfWork)
    {
        _courseRepository = courseRepository;
        _unitOfWork = unitOfWork;
    }

    // Create a new course for the current student
    public async Task<CourseResponse> CreateAsync(
        int studentId,
        CreateCourseRequest request)
    {
        var course = new Course
        {
            Name = request.Name,
            Description = request.Description,
            StudentId = studentId
        };

        await _courseRepository.AddAsync(course);

        await _unitOfWork.SaveChangesAsync();

        return new CourseResponse
        {
            Id = course.Id,
            Name = course.Name,
            Description = course.Description,
            CreatedAt = course.CreatedAt
        };
    }

    // Get all courses belonging to a specific student
    public async Task<IEnumerable<CourseResponse>> GetAllAsync(int studentId)
    {
        var courses = await _courseRepository.GetAllByStudentIdAsync(studentId);

        return courses.Select(course => new CourseResponse
        {
            Id = course.Id,
            Name = course.Name,
            Description = course.Description,
            CreatedAt = course.CreatedAt
        });
    }

    // Get a specific course belonging to a specific student
    public async Task<CourseResponse?> GetByIdAsync(int id, int studentId)
    {
        var course = await _courseRepository.GetByIdAsync(id, studentId);

        if (course is null)
            return null;

        return new CourseResponse
        {
            Id = course.Id,
            Name = course.Name,
            Description = course.Description,
            CreatedAt = course.CreatedAt
        };
    }

    // Update a course
    public async Task<bool> UpdateAsync(
        int id,
        int studentId,
        UpdateCourseRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(id, studentId);

        if (course is null)
            return false;

        course.Name = request.Name;
        course.Description = request.Description;

        _courseRepository.Update(course);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    // Delete a course
    public async Task<bool> DeleteAsync(int id, int studentId)
    {
        var course = await _courseRepository.GetByIdAsync(id, studentId);

        if (course is null)
            return false;

        _courseRepository.Delete(course);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
