
using Microsoft.AspNetCore.Mvc;
using TimeVerse.Application.DTOs.Authentication;
using TimeVerse.Application.Interfaces;

namespace TimeVerse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var response = await _authService.RegisterAsync(request);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request) //byst2bl el email w el password
    {
        var response = await _authService.LoginAsync(request);
        return Ok(response);
    }
}
