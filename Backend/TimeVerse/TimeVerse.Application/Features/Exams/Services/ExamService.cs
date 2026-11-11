using TimeVerse.Application.DTOs.Exams;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Features.Exams.Services;

public class ExamService : IExamService
{
    private readonly IExamRepository _examRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ExamService(
        IExamRepository examRepository,
        ICourseRepository courseRepository,
        IUnitOfWork unitOfWork)
    {
        _examRepository = examRepository;
        _courseRepository = courseRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ExamResponse> CreateAsync(
    int studentId,
    CreateExamRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(
            request.CourseId,
            studentId);

        if (course == null)
        {
            throw new InvalidOperationException(
                "Course not found or does not belong to this student.");
        }

        var exam = new Exam
        {
            CourseId = request.CourseId,
            Title = request.Title,
            ExamDate = request.ExamDate,
            Location = request.Location,
            Notes = request.Notes
        };

        await _examRepository.AddAsync(exam);

        await _unitOfWork.SaveChangesAsync();

        return new ExamResponse
        {
            Id = exam.Id,
            CourseId = exam.CourseId,
            Title = exam.Title,
            ExamDate = exam.ExamDate,
            Location = exam.Location,
            Notes = exam.Notes
        };
    }

    public async Task<bool> DeleteAsync(int id, int studentId)
    {
        var exam = await _examRepository.GetByIdAsync(id, studentId);

        if (exam == null)
        {
            return false;
        }

        _examRepository.Delete(exam);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<ExamResponse>> GetAllAsync(int studentId)
    {
        var exams = await _examRepository.GetAllByStudentIdAsync(studentId);

        return exams.Select(e => new ExamResponse
        {
            Id = e.Id,
            CourseId = e.CourseId,
            Title = e.Title,
            ExamDate = e.ExamDate,
            Location = e.Location,
            Notes = e.Notes
        });
    }

    public async Task<ExamResponse?> GetByIdAsync(int id, int studentId)
    {
        var exam = await _examRepository.GetByIdAsync(id, studentId);

        if (exam == null)
        {
            return null;
        }

        return new ExamResponse
        {
            Id = exam.Id,
            CourseId = exam.CourseId,
            Title = exam.Title,
            ExamDate = exam.ExamDate,
            Location = exam.Location,
            Notes = exam.Notes
        };
    }

    public async Task<bool> UpdateAsync(
    int id,
    int studentId,
    UpdateExamRequest request)
    {
        var exam = await _examRepository.GetByIdAsync(id, studentId);

        if (exam == null)
        {
            return false;
        }

        exam.Title = request.Title;
        exam.ExamDate = request.ExamDate;
        exam.Location = request.Location;
        exam.Notes = request.Notes;

        _examRepository.Update(exam);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}