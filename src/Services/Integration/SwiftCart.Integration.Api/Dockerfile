FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Services/Integration/SwiftCart.Integration.Api/SwiftCart.Integration.Api.csproj", "src/Services/Integration/SwiftCart.Integration.Api/"]
COPY ["src/Services/Integration/SwiftCart.Integration.Infrastructure/SwiftCart.Integration.Infrastructure.csproj", "src/Services/Integration/SwiftCart.Integration.Infrastructure/"]
COPY ["src/Services/Integration/SwiftCart.Integration.Application/SwiftCart.Integration.Application.csproj", "src/Services/Integration/SwiftCart.Integration.Application/"]
RUN dotnet restore "src/Services/Integration/SwiftCart.Integration.Api/SwiftCart.Integration.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/Integration/SwiftCart.Integration.Api"
RUN dotnet build "SwiftCart.Integration.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SwiftCart.Integration.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SwiftCart.Integration.Api.dll"]