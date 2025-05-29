// filename: NET8 V8\src\SwiftCart\src\Services\Cart\SwiftCart.Cart.Infrastructure\Clients\ProductApiClient.cs
using SwiftCart.Cart.Application.DTOs.ProductCatalog;
using SwiftCart.Cart.Application.Interfaces;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging; // For logging

namespace SwiftCart.Cart.Infrastructure.Clients // Assuming an Infrastructure or Clients folder
{
    public class ProductApiClient : IProductApiClient {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ProductApiClient> _logger; // For logging

        public ProductApiClient(HttpClient httpClient, ILogger<ProductApiClient> logger) {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<ProductCatalogDto?> GetProductByIdAsync(Guid productId) {
            // Assuming the Product service endpoint is /api/products/{id}
            var requestUri = $"/productservice/products/{productId}";
            _logger.LogInformation("Calling Product Service: GET {RequestUri}", requestUri);

            try {
                var response = await _httpClient.GetAsync(requestUri);

                if (response.StatusCode == HttpStatusCode.NotFound) {
                    _logger.LogWarning("Product with ID {ProductId} not found by Product Service (404).", productId);
                    return null; // Product not found
                }

                // Throw an exception for non-success status codes other than 404
                response.EnsureSuccessStatusCode();

                // Read and deserialize the response content
                var product = await response.Content.ReadFromJsonAsync<ProductCatalogDto>();

                if (product == null) {
                    _logger.LogError("Product Service returned success for ID {ProductId} but response body was empty or invalid.", productId);
                }
                return product;

            }
            catch (HttpRequestException ex) {
                _logger.LogError(ex, "HTTP request failed when calling Product Service for ID {ProductId}.", productId);
                // Depending on policy, you might re-throw a specific exception
                throw new Exception($"Failed to retrieve product {productId} from Product Service.", ex);
            }
            catch (Exception ex) // Catch other potential errors like JSON deserialization errors
            {
                _logger.LogError(ex, "An unexpected error occurred processing response from Product Service for ID {ProductId}.", productId);
                throw new Exception($"An unexpected error occurred retrieving product {productId}.", ex);
            }
        }
    }
}