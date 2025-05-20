namespace SwiftCart.Contracts.DTOs.Users;

public class AuthResponseData
{
    public string Token { get; set; } = string.Empty;
    public UserData User { get; set; } = new();
}