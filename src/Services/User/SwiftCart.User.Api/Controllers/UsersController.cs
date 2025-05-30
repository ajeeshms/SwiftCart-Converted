// filename: NET8 V8\src\SwiftCart\src\Services\User\SwiftCart.User.Api\Controllers\UsersController.cs
using Microsoft.AspNetCore.Mvc;
using SwiftCart.User.Application.DTOs;
using SwiftCart.User.Application.Interfaces;

namespace SwiftCart.User.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase {
    private readonly IUserService _userService;
    private readonly IWebHostEnvironment _env;

    public UsersController(IUserService userService, IWebHostEnvironment env) {
        _userService = userService;
        _env = env;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(Guid id) {
        var user = await _userService.GetByIdAsync(id);
        return Ok(user);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterUserDto registerDto) {
        var user = await _userService.RegisterAsync(registerDto);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto) // <-- Change return type to AuthResponseDto
    {
        var response = await _userService.LoginAsync(loginDto);

        var cookieOptions = new CookieOptions {
            HttpOnly = true,
            Secure = !_env.IsDevelopment(),
            SameSite = SameSiteMode.None,
            Expires = response.TokenExpiry
        };

        Response.Cookies.Append("SwiftCartAuthToken", response.Token, cookieOptions);

        // Return the full AuthResponseDto including the token and user
        return Ok(response); // <-- Return the full response object
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> Update(Guid id, UpdateUserDto updateDto) {
        if (id != updateDto.Id)
            return BadRequest();

        var user = await _userService.UpdateAsync(updateDto);
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) {
        await _userService.DeleteAsync(id);
        return NoContent();
    }
}