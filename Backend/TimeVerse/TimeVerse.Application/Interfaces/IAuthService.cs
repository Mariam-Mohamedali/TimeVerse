
using TimeVerse.Application.DTOs.Authentication;

namespace TimeVerse.Application.Interfaces;

public interface IAuthService //for login and registeration of student
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);
}
