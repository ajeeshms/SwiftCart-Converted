using Microsoft.AspNetCore.Mvc.RazorPages;
using SwiftCart.Integrations;
using SwiftCart.Models;

public class InvoiceModel : PageModel {
    private readonly NumericService _numericService;

    public InvoiceModel(NumericService numericService) {
        _numericService = numericService;
    }

    public List<CartItemModel> Cart { get; set; }
    public decimal Total { get; set; }
    public string TotalInWords { get; set; }

    public async Task OnGetAsync() {
        Cart = HttpContext.Session.GetObject<List<CartItemModel>>("Cart") ?? new List<CartItemModel>();
        Total = Cart.Sum(c => c.Total);
        TotalInWords = await _numericService.NumberToWords(Total);
    }
}
