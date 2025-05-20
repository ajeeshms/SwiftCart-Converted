using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using SwiftCart.Cart.Domain.Entities;
using SwiftCart.Cart.Domain.Repositories;

namespace SwiftCart.Cart.Infrastructure.Repositories;

public class RedisCartRepository : ICartRepository
{
    private readonly IDistributedCache _cache;
    private readonly DistributedCacheEntryOptions _options;

    public RedisCartRepository(IDistributedCache cache)
    {
        _cache = cache;
        _options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30),
            SlidingExpiration = TimeSpan.FromHours(2)
        };
    }

    public async Task<Domain.Entities.Cart> GetByIdAsync(Guid id)
    {
        var cartJson = await _cache.GetStringAsync($"cart:{id}");
        return cartJson == null 
            ? new Domain.Entities.Cart { Id = id, CreatedAt = DateTime.UtcNow, IsActive = true }
            : JsonSerializer.Deserialize<Domain.Entities.Cart>(cartJson) ?? throw new InvalidOperationException("Failed to deserialize cart");
    }

    public async Task<Domain.Entities.Cart> GetByUserIdAsync(Guid userId)
    {
        var cartJson = await _cache.GetStringAsync($"user:{userId}:cart");
        if (cartJson != null)
        {
            var cart = JsonSerializer.Deserialize<Domain.Entities.Cart>(cartJson);
            if (cart != null) return cart;
        }

        var newCart = new Domain.Entities.Cart
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        await CreateAsync(newCart);
        return newCart;
    }

    public async Task<Domain.Entities.Cart> CreateAsync(Domain.Entities.Cart cart)
    {
        var cartJson = JsonSerializer.Serialize(cart);
        await _cache.SetStringAsync($"cart:{cart.Id}", cartJson, _options);
        await _cache.SetStringAsync($"user:{cart.UserId}:cart", cartJson, _options);
        return cart;
    }

    public async Task<Domain.Entities.Cart> UpdateAsync(Domain.Entities.Cart cart)
    {
        var cartJson = JsonSerializer.Serialize(cart);
        await _cache.SetStringAsync($"cart:{cart.Id}", cartJson, _options);
        await _cache.SetStringAsync($"user:{cart.UserId}:cart", cartJson, _options);
        return cart;
    }

    public async Task DeleteAsync(Guid id)
    {
        var cart = await GetByIdAsync(id);
        await _cache.RemoveAsync($"cart:{id}");
        await _cache.RemoveAsync($"user:{cart.UserId}:cart");
    }
}