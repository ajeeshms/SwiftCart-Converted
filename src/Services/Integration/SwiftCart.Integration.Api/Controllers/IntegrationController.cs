using Microsoft.AspNetCore.Mvc;

namespace SwiftCart.Integration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IntegrationController : ControllerBase
{
    [HttpPost("webhook")]
    public async Task<IActionResult> HandleWebhook([FromBody] object payload)
    {
        // Implementation will be added later
        await Task.CompletedTask;
        return Ok();
    }

    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        return Ok(new { Status = "Operational" });
    }
}