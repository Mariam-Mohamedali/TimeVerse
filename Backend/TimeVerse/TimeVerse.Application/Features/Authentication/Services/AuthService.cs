using System;
using System.Collections.Generic;
using System.Text;
using TimeVerse.Application.DTOs.Authentication;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Features.Authentication.Services;

public class AuthService : IAuthService
{
    private readonly IStudentRepository _studentRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(IStudentRepository studentRepository, IPasswordHasher passwordHasher, ITokenService tokenService, IUnitOfWork unitOfWork)
    {
        _studentRepository = studentRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existingStudent = await _studentRepository.GetByEmailAsync(request.Email);
        if(existingStudent != null)
        {
            throw new Exception("Student with the same email already exists.");
        }
        var student = new Student
        {
            FullName = request.FullName,
            Email = request.Email,
            
        };
        student.PasswordHash = _passwordHasher.HashPassword(student,request.Password);
        await _studentRepository.AddAsync(student);
        await _unitOfWork.SaveChangesAsync();
        var token = _tokenService.GenerateToken(student);
        return new AuthResponse
        {
            Token = token,
            StudentId = student.Id,
            FullName = student.FullName,
            Email = student.Email
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var student = await _studentRepository.GetByEmailAsync(request.Email);
        if (student == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }
        var isPasswordValid = _passwordHasher.VerifyPassword(student, student.PasswordHash, request.Password);

        if (!isPasswordValid)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var token = _tokenService.GenerateToken(student);
        return new AuthResponse
        {
            Token = token,
            StudentId = student.Id,
            FullName = student.FullName,
            Email = student.Email
        };
    }

}
