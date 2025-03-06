using AutoMapper;

namespace SwiftCart.Models.Profiles {
    public class CartItemProfile : Profile {
        public CartItemProfile() {
            CreateMap<ProductModel, CartItemModel>()
                .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.ID))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl));
        }
    }
}
