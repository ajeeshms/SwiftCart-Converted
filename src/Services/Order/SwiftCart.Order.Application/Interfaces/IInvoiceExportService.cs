using System;
using System.Threading.Tasks;

namespace SwiftCart.Order.Application.Interfaces;

/// <summary>
/// Service for exporting order invoice details.
/// </summary>
public interface IInvoiceExportService {
    /// <summary>
    /// Exports the invoice details for a specific order to an Excel byte array.
    /// </summary>
    /// <param name="orderId">The ID of the order to export.</param>
    /// <returns>A byte array containing the Excel file content.</returns>
    /// <exception cref="KeyNotFoundException">Thrown if the order with the specified ID is not found.</exception>
    Task<byte[]> ExportOrderInvoiceAsync(Guid orderId);
}