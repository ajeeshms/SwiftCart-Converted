using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Extensions.Http;
using Polly.Timeout;
using System;
using System.Net.Http;

namespace SwiftCart.BuildingBlocks.Resilience;

public static class ResilienceExtensions
{
    public static IHttpClientBuilder AddResiliencePolicies(this IHttpClientBuilder builder, int retryCount = 3, int circuitBreakerFailureThreshold = 5)
    {
        return builder
            .AddRetryPolicy(retryCount)
            .AddCircuitBreakerPolicy(circuitBreakerFailureThreshold)
            .AddTimeoutPolicy();
    }

    public static IHttpClientBuilder AddRetryPolicy(this IHttpClientBuilder builder, int retryCount = 3)
    {
        return builder.AddPolicyHandler(HttpPolicyExtensions
            .HandleTransientHttpError()
            .WaitAndRetryAsync(retryCount, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))));
    }

    public static IHttpClientBuilder AddCircuitBreakerPolicy(this IHttpClientBuilder builder, int circuitBreakerFailureThreshold = 5)
    {
        return builder.AddPolicyHandler(HttpPolicyExtensions
            .HandleTransientHttpError()
            .CircuitBreakerAsync(circuitBreakerFailureThreshold, TimeSpan.FromMinutes(1)));
    }

    public static IHttpClientBuilder AddTimeoutPolicy(this IHttpClientBuilder builder, int timeoutInSeconds = 30)
    {
        return builder.AddPolicyHandler(Policy.TimeoutAsync<HttpResponseMessage>(timeoutInSeconds));
    }
}