using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SwiftCart.Models;

public class CartModel : PageModel {
    public List<CartItemModel> Cart { get; set; }

    public void OnGet() {
        Cart = HttpContext.Session.GetObject<List<CartItemModel>>("Cart") ?? new List<CartItemModel>();
    }

    public IActionResult OnPostRemove(int id) {
        var cart = HttpContext.Session.GetObject<List<CartItemModel>>("Cart") ?? new List<CartItemModel>();
        cart.RemoveAll(c => c.ID == id);
        HttpContext.Session.SetObject("Cart", cart);
        return RedirectToPage();
    }
}
