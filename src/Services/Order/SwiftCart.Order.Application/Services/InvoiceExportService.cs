using SwiftCart.Order.Application.Interfaces;
using SwiftCart.Order.Domain.Repositories;
using ClosedXML.Excel; // Add ClosedXML using
using System;
using System.IO; // Add System.IO using
using System.Threading.Tasks;
using System.Collections.Generic; // Needed for KeyNotFoundException

namespace SwiftCart.Order.Application.Services;

/// <summary>
/// Service to generate Excel files for order invoices.
/// </summary>
public class InvoiceExportService : IInvoiceExportService {
    private readonly IOrderRepository _orderRepository;

    public InvoiceExportService(IOrderRepository orderRepository) {
        _orderRepository = orderRepository;
    }

    public async Task<byte[]> ExportOrderInvoiceAsync(Guid orderId) {
        var order = await _orderRepository.GetByIdAsync(orderId);

        // GetByIdAsync already throws KeyNotFoundException, so no need to check for null here
        // if (order == null) { /* handled by repository */ }


        using (var workbook = new XLWorkbook()) {
            var worksheet = workbook.Worksheets.Add($"Invoice");

            // --- Invoice Header ---
            int currentRow = 1;
            worksheet.Cell(currentRow, 1).Value = "Invoice Details";
            // Corrected Styling for ClosedXML 0.100+
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 1).Style.Font.FontSize = 14;

            currentRow += 2;
            worksheet.Cell(currentRow, 1).Value = "Order ID:";
            worksheet.Cell(currentRow, 2).Value = order.Id.ToString(); // Convert Guid to string for XLCellValue
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = "Order Number:";
            worksheet.Cell(currentRow, 2).Value = order.OrderNumber;
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = "User ID:";
            worksheet.Cell(currentRow, 2).Value = order.UserId.ToString(); // Convert Guid to string for XLCellValue
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = "Status:";
            worksheet.Cell(currentRow, 2).Value = order.Status.ToString();
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = "Created At:";
            worksheet.Cell(currentRow, 2).Value = order.CreatedAt;
            worksheet.Cell(currentRow, 2).Style.DateFormat.SetFormat("yyyy-MM-dd HH:mm");
            currentRow++;
            if (order.UpdatedAt.HasValue) {
                worksheet.Cell(currentRow, 1).Value = "Updated At:";
                worksheet.Cell(currentRow, 2).Value = order.UpdatedAt.Value;
                worksheet.Cell(currentRow, 2).Style.DateFormat.SetFormat("yyyy-MM-dd HH:mm");
                currentRow++;
            }


            // --- Addresses ---
            currentRow += 2;
            worksheet.Cell(currentRow, 1).Value = "Shipping Address";
            // Corrected Styling for ClosedXML 0.100+
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"Street: {order.ShippingAddress?.Street}";
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"City: {order.ShippingAddress?.City}";
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"State: {order.ShippingAddress?.State}";
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"Zip: {order.ShippingAddress?.ZipCode}";
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"Country: {order.ShippingAddress?.Country}";

            currentRow += 2;
            worksheet.Cell(currentRow, 1).Value = "Billing Address";
            // Corrected Styling for ClosedXML 0.100+
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"Street: {order.BillingAddress?.Street}";
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"City: {order.BillingAddress?.City}";
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"State: {order.BillingAddress?.State}";
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"Zip: {order.BillingAddress?.ZipCode}";
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = $"Country: {order.BillingAddress?.Country}";

            // --- Payment Info ---
            currentRow += 2;
            worksheet.Cell(currentRow, 1).Value = "Payment Information";
            // Corrected Styling for ClosedXML 0.100+
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = "Transaction ID:";
            // Handle nullable Guid? - Convert to string if value exists, otherwise it will be empty in Excel
            worksheet.Cell(currentRow, 2).Value = order.PaymentInfo?.TransactionId.ToString();
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = "Payment Status:";
            worksheet.Cell(currentRow, 2).Value = order.PaymentInfo?.Status.ToString();
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = "Payment Method:";
            worksheet.Cell(currentRow, 2).Value = order.PaymentInfo?.Method.ToString();
            currentRow++;
            if (order.PaymentInfo?.PaidAt.HasValue ?? false) {
                worksheet.Cell(currentRow, 1).Value = "Paid At:";
                worksheet.Cell(currentRow, 2).Value = order.PaymentInfo.PaidAt.Value;
                worksheet.Cell(currentRow, 2).Style.DateFormat.SetFormat("yyyy-MM-dd HH:mm");
                currentRow++;
            }


            // --- Order Items ---
            currentRow += 2;
            worksheet.Cell(currentRow, 1).Value = "Order Items";
            // Corrected Styling for ClosedXML 0.100+
            worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 1).Style.Font.FontSize = 12;

            currentRow++;
            var itemHeaderRow = worksheet.Row(currentRow);
            // Corrected Styling for ClosedXML 0.100+
            itemHeaderRow.Style.Font.Bold = true;
            worksheet.Cell(currentRow, 1).Value = "Item ID";
            worksheet.Cell(currentRow, 2).Value = "Product ID";
            worksheet.Cell(currentRow, 3).Value = "Product Name";
            worksheet.Cell(currentRow, 4).Value = "Quantity";
            worksheet.Cell(currentRow, 5).Value = "Unit Price";
            worksheet.Cell(currentRow, 6).Value = "Total Price";


            currentRow++;
            foreach (var item in order.Items) {
                worksheet.Cell(currentRow, 1).Value = item.Id.ToString(); // Convert Guid to string
                worksheet.Cell(currentRow, 2).Value = item.ProductId.ToString(); // Convert Guid to string
                worksheet.Cell(currentRow, 3).Value = item.ProductName;
                worksheet.Cell(currentRow, 4).Value = item.Quantity;
                worksheet.Cell(currentRow, 5).Value = item.UnitPrice;
                worksheet.Cell(currentRow, 5).Style.NumberFormat.SetFormat("$#,##0.00"); // Example Currency Format
                worksheet.Cell(currentRow, 6).Value = item.TotalPrice;
                worksheet.Cell(currentRow, 6).Style.NumberFormat.SetFormat("$#,##0.00"); // Example Currency Format
                currentRow++;
            }

            // --- Summary ---
            currentRow++;
            worksheet.Cell(currentRow, 5).Value = "Grand Total:";
            // Corrected Styling for ClosedXML 0.100+
            worksheet.Cell(currentRow, 5).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right; // Corrected Alignment
            worksheet.Cell(currentRow, 6).Value = order.TotalAmount;
            // Corrected Styling for ClosedXML 0.100+
            worksheet.Cell(currentRow, 6).Style.Font.Bold = true;
            worksheet.Cell(currentRow, 6).Style.NumberFormat.SetFormat("$#,##0.00"); // Example Currency Format


            // Adjust column widths to fit the contents
            worksheet.Columns().AdjustToContents();

            // Save the workbook to a MemoryStream
            using (var stream = new MemoryStream()) {
                workbook.SaveAs(stream);
                return stream.ToArray();
            }
        }
    }
}