using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SwiftCart.Data;
using SwiftCart.Models;

public class ProductsModel : PageModel {
    private readonly IProductRepository _productRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ProductsModel(IProductRepository productRepository, IHttpContextAccessor httpContextAccessor) {
        _productRepository = productRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public List<ProductModel> Products { get; set; }

    public void OnGet() {
        Products = _productRepository.Get(1, 10).ToList();
    }

    public IActionResult OnPostAddToCart(int id, int quantity) {
        var cart = HttpContext.Session.GetObject<List<CartItemModel>>("Cart") ?? new List<CartItemModel>();
        var product = _productRepository.Get(new[] { id }).FirstOrDefault();
        if (product != null) {
            var cartItem = cart.FirstOrDefault(c => c.ID == id);
            if (cartItem != null) {
                cartItem.Quantity += quantity;
            }
            else {
                cart.Add(new CartItemModel { ID = product.ID, Name = product.Name, Price = product.Price, Quantity = quantity, ImageUrl = product.ImageUrl });
            }
            HttpContext.Session.SetObject("Cart", cart);
        }
        return RedirectToPage();
    }
}
