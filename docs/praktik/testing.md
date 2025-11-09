# 25. Testing och Unit Tests

Automatiserad testning är avgörande för att säkerställa att din kod fungerar korrekt.

## Varför Testa?

- **Förhindra buggar** - Upptäck fel tidigt
- **Dokumentation** - Tester visar hur kod ska användas
- **Trygghet** - Refaktorera utan rädsla
- **Design** - Tester driver bättre design

## xUnit Setup

```bash
# Skapa test-projekt
dotnet new xunit -n MyApp.Tests

# Lägg till referens till huvudprojekt
dotnet add MyApp.Tests reference MyApp/MyApp.csproj
```

## Grundläggande Test

```csharp
public class Calculator
{
    public int Add(int a, int b) => a + b;
    public int Subtract(int a, int b) => a - b;
    public double Divide(int a, int b)
    {
        if (b == 0)
            throw new DivideByZeroException();
        return (double)a / b;
    }
}

// Test-klass
public class CalculatorTests
{
    [Fact]
    public void Add_TwoNumbers_ReturnsSum()
    {
        // Arrange
        var calculator = new Calculator();
        
        // Act
        var result = calculator.Add(5, 3);
        
        // Assert
        Assert.Equal(8, result);
    }
    
    [Theory]
    [InlineData(5, 3, 8)]
    [InlineData(10, 5, 15)]
    [InlineData(-5, 5, 0)]
    [InlineData(0, 0, 0)]
    public void Add_VariousInputs_ReturnsCorrectSum(int a, int b, int expected)
    {
        // Arrange
        var calculator = new Calculator();
        
        // Act
        var result = calculator.Add(a, b);
        
        // Assert
        Assert.Equal(expected, result);
    }
    
    [Fact]
    public void Divide_ByZero_ThrowsException()
    {
        // Arrange
        var calculator = new Calculator();
        
        // Act & Assert
        Assert.Throws<DivideByZeroException>(() => calculator.Divide(10, 0));
    }
}
```

## Assert Methods

```csharp
public class AssertExamples
{
    [Fact]
    public void DemonstrateAsserts()
    {
        // Equality
        Assert.Equal(5, 5);
        Assert.NotEqual(5, 3);
        
        // Boolean
        Assert.True(true);
        Assert.False(false);
        
        // Null checks
        string? nullString = null;
        string validString = "test";
        Assert.Null(nullString);
        Assert.NotNull(validString);
        
        // Collections
        var list = new List<int> { 1, 2, 3 };
        Assert.Contains(2, list);
        Assert.DoesNotContain(5, list);
        Assert.Empty(new List<int>());
        Assert.NotEmpty(list);
        Assert.Single(new List<int> { 1 });
        
        // Strings
        Assert.StartsWith("Hello", "Hello World");
        Assert.EndsWith("World", "Hello World");
        Assert.Contains("lo Wo", "Hello World");
        
        // Ranges
        Assert.InRange(5, 1, 10);
        
        // Types
        Assert.IsType<string>("test");
        Assert.IsAssignableFrom<object>("test");
    }
}
```

## Testing med Dependency Injection

```csharp
public interface IEmailService
{
    void SendEmail(string to, string message);
}

public class OrderService
{
    private readonly IEmailService emailService;
    
    public OrderService(IEmailService emailService)
    {
        this.emailService = emailService;
    }
    
    public void PlaceOrder(Order order)
    {
        // Processera order...
        emailService.SendEmail(order.CustomerEmail, "Order confirmed");
    }
}

// Test med mock
public class FakeEmailService : IEmailService
{
    public List<(string To, string Message)> SentEmails { get; } = new();
    
    public void SendEmail(string to, string message)
    {
        SentEmails.Add((to, message));
    }
}

public class OrderServiceTests
{
    [Fact]
    public void PlaceOrder_SendsConfirmationEmail()
    {
        // Arrange
        var fakeEmailService = new FakeEmailService();
        var orderService = new OrderService(fakeEmailService);
        var order = new Order { CustomerEmail = "test@email.com" };
        
        // Act
        orderService.PlaceOrder(order);
        
        // Assert
        Assert.Single(fakeEmailService.SentEmails);
        Assert.Equal("test@email.com", fakeEmailService.SentEmails[0].To);
        Assert.Contains("confirmed", fakeEmailService.SentEmails[0].Message);
    }
}
```

## Moq - Mocking Framework

```bash
dotnet add package Moq
```

```csharp
using Moq;

public class OrderServiceTests_WithMoq
{
    [Fact]
    public void PlaceOrder_SendsEmail_UsingMoq()
    {
        // Arrange
        var mockEmailService = new Mock<IEmailService>();
        var orderService = new OrderService(mockEmailService.Object);
        var order = new Order { CustomerEmail = "test@email.com" };
        
        // Act
        orderService.PlaceOrder(order);
        
        // Assert
        mockEmailService.Verify(
            s => s.SendEmail("test@email.com", It.IsAny<string>()), 
            Times.Once
        );
    }
    
    [Fact]
    public void GetOrderTotal_CalculatesWithDiscount()
    {
        // Arrange
        var mockDiscountService = new Mock<IDiscountService>();
        mockDiscountService
            .Setup(s => s.GetDiscount(It.IsAny<Customer>()))
            .Returns(0.1m); // 10% rabatt
        
        var service = new PriceCalculator(mockDiscountService.Object);
        var customer = new Customer { Type = CustomerType.Premium };
        
        // Act
        var total = service.CalculateTotal(100m, customer);
        
        // Assert
        Assert.Equal(90m, total);
    }
}
```

## Test Fixtures

Dela setup mellan tester:

```csharp
public class DatabaseFixture : IDisposable
{
    public DatabaseContext Db { get; private set; }
    
    public DatabaseFixture()
    {
        Db = new DatabaseContext("TestConnection");
        Db.Database.EnsureCreated();
    }
    
    public void Dispose()
    {
        Db.Database.EnsureDeleted();
        Db.Dispose();
    }
}

public class ProductRepositoryTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseContext db;
    
    public ProductRepositoryTests(DatabaseFixture fixture)
    {
        db = fixture.Db;
    }
    
    [Fact]
    public void AddProduct_SavesToDatabase()
    {
        // Arrange
        var repo = new ProductRepository(db);
        var product = new Product { Name = "Test" };
        
        // Act
        repo.Add(product);
        
        // Assert
        Assert.NotEqual(0, product.Id);
    }
}
```

## Integration Testing

```csharp
public class ApiTests
{
    [Fact]
    public async Task GetProducts_ReturnsJsonArray()
    {
        // Arrange
        using var client = new HttpClient();
        client.BaseAddress = new Uri("http://localhost:5000");
        
        // Act
        var response = await client.GetAsync("/api/products");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("[", content);
    }
}
```

## Test-Driven Development (TDD)

1. **Red** - Skriv ett test som misslyckas
2. **Green** - Skriv minimal kod för att få testet att gå igenom
3. **Refactor** - Förbättra koden

```csharp
// 1. RED - Skriv test först
public class StringHelperTests
{
    [Theory]
    [InlineData("hello", "Hello")]
    [InlineData("WORLD", "World")]
    [InlineData("c#", "C#")]
    public void Capitalize_FirstLetter_ReturnsCapitalized(string input, string expected)
    {
        var result = StringHelper.Capitalize(input);
        Assert.Equal(expected, result);
    }
}

// 2. GREEN - Implementera
public static class StringHelper
{
    public static string Capitalize(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;
        
        return char.ToUpper(input[0]) + input.Substring(1).ToLower();
    }
}

// 3. REFACTOR - Förbättra
public static class StringHelper
{
    public static string Capitalize(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;
        
        return string.Create(input.Length, input, (span, str) =>
        {
            str.AsSpan().CopyTo(span);
            span[0] = char.ToUpper(span[0]);
            span[1..].ToLower();
        });
    }
}
```

## Best Practices

```csharp
public class TestingBestPractices
{
    // ✅ GOOD: Tydligt namn som beskriver vad som testas
    [Fact]
    public void GetCustomer_WithInvalidId_ThrowsArgumentException()
    {
        // Test implementation
    }
    
    // ❌ BAD: Oklart namn
    [Fact]
    public void Test1()
    {
        // Test implementation
    }
    
    // ✅ GOOD: Ett koncept per test
    [Fact]
    public void Add_TwoPositiveNumbers_ReturnsSum()
    {
        var calc = new Calculator();
        Assert.Equal(8, calc.Add(5, 3));
    }
    
    // ❌ BAD: Flera koncept i samma test
    [Fact]
    public void Calculator_Tests()
    {
        var calc = new Calculator();
        Assert.Equal(8, calc.Add(5, 3));
        Assert.Equal(2, calc.Subtract(5, 3));
        Assert.Equal(15, calc.Multiply(5, 3));
    }
}
```

## Köra Tester

```bash
# Kör alla tester
dotnet test

# Kör specifikt test
dotnet test --filter "FullyQualifiedName~CalculatorTests"

# Med code coverage
dotnet test --collect:"XPlat Code Coverage"

# I watch mode (kör vid ändring)
dotnet watch test
```

!!! success "Testing Checklist"
    - [ ] Namnge tester tydligt (Method_Scenario_ExpectedResult)
    - [ ] Följ Arrange-Act-Assert mönstret
    - [ ] Ett koncept per test
    - [ ] Testa edge cases och null
    - [ ] Använd Theory för liknande tester
    - [ ] Mock externa dependencies
    - [ ] Håll tester snabba och oberoende

## Nästa lektion

Lär dig om [UML och Klassdiagram](uml.md).
