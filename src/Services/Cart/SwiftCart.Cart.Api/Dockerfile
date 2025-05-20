FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Services/Cart/SwiftCart.Cart.Api/SwiftCart.Cart.Api.csproj", "src/Services/Cart/SwiftCart.Cart.Api/"]
COPY ["src/Services/Cart/SwiftCart.Cart.Infrastructure/SwiftCart.Cart.Infrastructure.csproj", "src/Services/Cart/SwiftCart.Cart.Infrastructure/"]
COPY ["src/Services/Cart/SwiftCart.Cart.Application/SwiftCart.Cart.Application.csproj", "src/Services/Cart/SwiftCart.Cart.Application/"]
COPY ["src/Services/Cart/SwiftCart.Cart.Domain/SwiftCart.Cart.Domain.csproj", "src/Services/Cart/SwiftCart.Cart.Domain/"]
RUN dotnet restore "src/Services/Cart/SwiftCart.Cart.Api/SwiftCart.Cart.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/Cart/SwiftCart.Cart.Api"
RUN dotnet build "SwiftCart.Cart.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SwiftCart.Cart.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SwiftCart.Cart.Api.dll"]