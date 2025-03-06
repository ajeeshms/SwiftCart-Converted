using AutoMapper;
using SwiftCart.Data;

namespace SwiftCart.Models.Profiles {
    public class ProductProfile : Profile {
        public ProductProfile() {
            CreateMap<Product, ProductModel>()
                .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.ListPrice))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => ConvertImageToBase64(src.ThumbNailPhoto)));
        }

        private static string? ConvertImageToBase64(byte[]? imageData) {
            if (imageData == null || imageData.Length == 0) return null;
            return $"data:image/png;base64,{Convert.ToBase64String(imageData)}";
        }
    }
}
