FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Services/Product/SwiftCart.Product.Api/SwiftCart.Product.Api.csproj", "src/Services/Product/SwiftCart.Product.Api/"]
COPY ["src/Services/Product/SwiftCart.Product.Infrastructure/SwiftCart.Product.Infrastructure.csproj", "src/Services/Product/SwiftCart.Product.Infrastructure/"]
COPY ["src/Services/Product/SwiftCart.Product.Application/SwiftCart.Product.Application.csproj", "src/Services/Product/SwiftCart.Product.Application/"]
COPY ["src/Services/Product/SwiftCart.Product.Domain/SwiftCart.Product.Domain.csproj", "src/Services/Product/SwiftCart.Product.Domain/"]
RUN dotnet restore "src/Services/Product/SwiftCart.Product.Api/SwiftCart.Product.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/Product/SwiftCart.Product.Api"
RUN dotnet build "SwiftCart.Product.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SwiftCart.Product.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SwiftCart.Product.Api.dll"]