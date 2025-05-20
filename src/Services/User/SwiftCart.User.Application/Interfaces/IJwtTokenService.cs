using SwiftCart.User.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SwiftCart.User.Application.Interfaces
{
    public interface IJwtTokenService
    {
        Task<AuthResponseDto> GenerateTokenAsync(UserDto user);
    }
}
