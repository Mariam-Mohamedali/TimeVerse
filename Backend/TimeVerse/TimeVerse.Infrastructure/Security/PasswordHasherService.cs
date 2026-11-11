using Microsoft.AspNetCore.Identity;
using TimeVerse.Application.Interfaces;
using TimeVerse.Domain.Entities;

namespace TimeVerse.Infrastructure.Security;

public class PasswordHasherService : IPasswordHasher
{
    private readonly IPasswordHasher<Student> _passwordHasher;

    public PasswordHasherService(
        IPasswordHasher<Student> passwordHasher)
    {
        _passwordHasher = passwordHasher;
    }

    public string HashPassword(Student student, string password)
    {
        return _passwordHasher.HashPassword(student, password);
    }

    public bool VerifyPassword(
        Student student,
        string hashedPassword,
        string providedPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(
            student,
            hashedPassword,
            providedPassword);

        return result != PasswordVerificationResult.Failed;
    }
}