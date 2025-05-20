namespace SwiftCart.User.Application.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;

    public DateTime TokenExpiry { get; set; } = DateTime.UtcNow;
    public UserDto User { get; set; } = new();
}