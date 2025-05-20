using AutoMapper;
using SwiftCart.User.Application.DTOs;
using SwiftCart.User.Domain.Entities;

namespace SwiftCart.User.Application.Mapping;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<Domain.Entities.User, UserDto>();
        CreateMap<RegisterUserDto, Domain.Entities.User>();
        CreateMap<UpdateUserDto, Domain.Entities.User>();
    }
}