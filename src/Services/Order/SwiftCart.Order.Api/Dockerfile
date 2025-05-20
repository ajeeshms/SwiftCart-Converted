```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Services/Order/SwiftCart.Order.Api/SwiftCart.Order.Api.csproj", "src/Services/Order/SwiftCart.Order.Api/"]
COPY ["src/Services/Order/SwiftCart.Order.Infrastructure/SwiftCart.Order.Infrastructure.csproj", "src/Services/Order/SwiftCart.Order.Infrastructure/"]
COPY ["src/Services/Order/SwiftCart.Order.Application/SwiftCart.Order.Application.csproj", "src/Services/Order/SwiftCart.Order.Application/"]
COPY ["src/Services/Order/SwiftCart.Order.Domain/SwiftCart.Order.Domain.csproj", "src/Services/Order/SwiftCart.Order.Domain/"]
RUN dotnet restore "src/Services/Order/SwiftCart.Order.Api/SwiftCart.Order.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/Order/SwiftCart.Order.Api"
RUN dotnet build "SwiftCart.Order.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SwiftCart.Order.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SwiftCart.Order.Api.dll"]
```