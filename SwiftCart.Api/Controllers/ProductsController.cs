using Microsoft.AspNetCore.Mvc;
using SwiftCart.Data;
using SwiftCart.Models;

namespace SwiftCart.Api.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase {
        private readonly IProductRepository _repo;

        public ProductsController(IProductRepository repo) {
            _repo = repo;
        }

        [HttpGet]
        public IActionResult Get(int page = 1, int size = 10) {
            var products = _repo.Get(page, size);
            return Ok(products);
        }
    }
}
