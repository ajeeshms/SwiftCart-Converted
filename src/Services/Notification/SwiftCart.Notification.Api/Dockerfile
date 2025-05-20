FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Services/Notification/SwiftCart.Notification.Api/SwiftCart.Notification.Api.csproj", "src/Services/Notification/SwiftCart.Notification.Api/"]
COPY ["src/Services/Notification/SwiftCart.Notification.Infrastructure/SwiftCart.Notification.Infrastructure.csproj", "src/Services/Notification/SwiftCart.Notification.Infrastructure/"]
COPY ["src/Services/Notification/SwiftCart.Notification.Application/SwiftCart.Notification.Application.csproj", "src/Services/Notification/SwiftCart.Notification.Application/"]
RUN dotnet restore "src/Services/Notification/SwiftCart.Notification.Api/SwiftCart.Notification.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/Notification/SwiftCart.Notification.Api"
RUN dotnet build "SwiftCart.Notification.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SwiftCart.Notification.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SwiftCart.Notification.Api.dll"]