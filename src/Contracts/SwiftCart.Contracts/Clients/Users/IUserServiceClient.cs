using System;
using System.Threading.Tasks;
using SwiftCart.Contracts.DTOs.Users;

namespace SwiftCart.Contracts.Clients.Users;

public interface IUserServiceClient
{
    Task<UserData> GetByIdAsync(Guid id);
    Task<UserData> RegisterAsync(RegisterUserData registerData);
    Task<AuthResponseData> LoginAsync(LoginData loginData);
    Task<UserData> UpdateAsync(UpdateUserData updateData);
    Task DeleteAsync(Guid id);
}