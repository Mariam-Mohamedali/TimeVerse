
namespace TimeVerse.Application.DTOs.Authentication;

public class AuthResponse
{
    public int StudentId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;
}
