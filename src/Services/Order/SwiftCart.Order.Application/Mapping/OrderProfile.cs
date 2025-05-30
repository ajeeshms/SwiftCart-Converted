//using AutoMapper;
//using SwiftCart.Order.Application.DTOs;
//using SwiftCart.Order.Domain.Entities;

//namespace SwiftCart.Order.Application.Mapping;

//public class OrderProfile : Profile
//{
//    public OrderProfile()
//    {
//        CreateMap<Domain.Entities.Order, OrderDto>();
//        CreateMap<OrderItem, OrderItemDto>();
//        CreateMap<Address, AddressDto>();
//        CreateMap<PaymentInfo, PaymentInfoDto>();
//    }
//}

// filename: NET8 V8\src\SwiftCart\src\Services\Order\SwiftCart.Order.Application\MappingProfiles\OrderMappingProfile.cs
using AutoMapper;
using SwiftCart.Order.Application.DTOs;
using SwiftCart.Order.Domain.Entities;
using SwiftCart.Order.Domain.Enums; // Ensure enums are accessible if mapping is needed

namespace SwiftCart.Order.Application.MappingProfiles {
    public class OrderMappingProfile : Profile {
        public OrderMappingProfile() {
            // Map OrderDto to Order entity
            // AutoMapper will map properties with the same name automatically.
            // If backend generates Id/OrderNumber/Timestamps, you might ignore them here:
            CreateMap<OrderDto, Domain.Entities.Order>();
            // .ForMember(dest => dest.Id, opt => opt.Ignore()) // Uncomment if backend always generates new ID
            // .ForMember(dest => dest.OrderNumber, opt => opt.Ignore()) // Uncomment if backend always generates OrderNumber
            // .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Uncomment if backend always sets CreatedAt on creation
            // .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()); // Uncomment if backend handles UpdatedAt


            // Map OrderItemDto to OrderItem entity
            CreateMap<OrderItemDto, OrderItem>();
            // .ForMember(dest => dest.Id, opt => opt.Ignore()) // Uncomment if backend always generates new ID for items
            // .ForMember(dest => dest.OrderId, opt => opt.Ignore()); // Uncomment if backend sets OrderId when saving items


            // Map AddressDto to Address value object/entity
            CreateMap<AddressDto, Address>();

            // Map PaymentInfoDto to PaymentInfo value object/entity
            // AutoMapper handles mapping integer enum values to C# enums by default if the integer value matches an enum member.
            // If you are using string enums on the frontend and need string-to-enum mapping,
            // you'd need to configure JsonStringEnumConverter in your backend API's JSON options.
            // Based on the previous error, sending integers (0, 1) seems to be what's expected,
            // and AutoMapper handles int-to-enum mapping automatically.
            CreateMap<PaymentInfoDto, PaymentInfo>();


            // Also add reverse mappings for retrieving data (GetById, GetByUserId)
            CreateMap<Domain.Entities.Order, OrderDto>();
            CreateMap<OrderItem, OrderItemDto>();
            CreateMap<Address, AddressDto>();
            CreateMap<PaymentInfo, PaymentInfoDto>();
        }
    }
}