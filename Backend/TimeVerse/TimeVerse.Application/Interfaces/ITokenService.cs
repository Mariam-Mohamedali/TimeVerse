
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(Student student);
}
