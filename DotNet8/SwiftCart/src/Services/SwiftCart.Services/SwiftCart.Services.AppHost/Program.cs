var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.SwiftCart_Cart_Api>("swiftcart-cart-api");

builder.AddProject<Projects.SwiftCart_Order_Api>("swiftcart-order-api");

builder.AddProject<Projects.SwiftCart_Product_Api>("swiftcart-product-api");

builder.AddProject<Projects.SwiftCart_Integration_Api>("swiftcart-integration-api");

builder.AddProject<Projects.SwiftCart_Notification_Api>("swiftcart-notification-api");

builder.Build().Run();
