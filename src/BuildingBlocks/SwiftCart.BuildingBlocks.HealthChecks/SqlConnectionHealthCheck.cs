using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SwiftCart.BuildingBlocks.HealthChecks;

public class SqlConnectionHealthCheck : IHealthCheck
{
    private readonly string _connectionString;
    private readonly string _sql;

    public SqlConnectionHealthCheck(string connectionString, string sql = "SELECT 1")
    {
        _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        _sql = sql;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(cancellationToken);

            using var command = connection.CreateCommand();
            command.CommandText = _sql;

            await command.ExecuteScalarAsync(cancellationToken);

            return HealthCheckResult.Healthy("SQL Server connection is healthy");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("SQL Server connection is unhealthy", ex);
        }
    }
}

public static class SqlConnectionHealthCheckExtensions
{
    public static IHealthChecksBuilder AddSqlConnectionHealthCheck(
        this IHealthChecksBuilder builder,
        string connectionString,
        string name = "sql",
        HealthStatus? failureStatus = default,
        IEnumerable<string>? tags = default,
        TimeSpan? timeout = default)
    {
        return builder.Add(new HealthCheckRegistration(
            name,
            sp => new SqlConnectionHealthCheck(connectionString),
            failureStatus,
            tags,
            timeout));
    }
}