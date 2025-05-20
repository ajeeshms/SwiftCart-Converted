using SwiftCart.User.Application.DTOs;

namespace SwiftCart.User.Application.Interfaces;

public interface IUserService
{
    Task<UserDto> GetByIdAsync(Guid id);
    Task<UserDto> RegisterAsync(RegisterUserDto registerDto);
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<UserDto> UpdateAsync(UpdateUserDto updateDto);
    Task DeleteAsync(Guid id);
}