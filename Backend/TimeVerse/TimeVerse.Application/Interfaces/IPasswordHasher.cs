
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface IPasswordHasher
{
    string HashPassword(Student student, string password);

    bool VerifyPassword(
        Student student,
        string hashedPassword,
        string providedPassword);
}
