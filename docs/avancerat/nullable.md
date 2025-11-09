# 22. Nullable Reference Types (C# 8+)

Nullable reference types hjälper förhindra null reference exceptions genom att göra nullability explicit.

## Enable Nullable

```csharp
#nullable enable

public class Person
{
    // Kan inte vara null
    public string Name { get; set; }
    
    // Kan vara null
    public string? MiddleName { get; set; }
    public string? Email { get; set; }
    
    public Person(string name)
    {
        Name = name; // OK
        // Name = null; // VARNING från compiler!
    }
}
```

## Null-conditional Operator (?.)

```csharp
public class OrderService
{
    public void ProcessOrder(Order? order)
    {
        // Null-conditional operator (?.)
        string? customerName = order?.Customer?.Name;
        
        // Säkert anrop
        order?.Ship();
        
        // Med indexing
        var firstItem = order?.Items?[0];
        
        // Med LINQ
        var total = order?.Items?.Sum(i => i.Price) ?? 0;
    }
}
```

## Null-coalescing Operators

```csharp
public class CustomerService
{
    public string GetDisplayName(Customer? customer)
    {
        // Null-coalescing operator (??)
        string name = customer?.Name ?? "Okänd kund";
        
        // Null-coalescing assignment (??=)
        string? cachedName = null;
        cachedName ??= LoadNameFromDatabase();
        
        return name;
    }
    
    private string LoadNameFromDatabase()
    {
        return "Namn från DB";
    }
}
```

## Null-forgiving Operator (!)

```csharp
public class DataService
{
    private string? cachedData;
    
    public string GetData()
    {
        if (cachedData == null)
        {
            cachedData = LoadDataFromDatabase();
        }
        
        // Vi vet att cachedData inte är null här
        return cachedData!; // ! = null-forgiving operator
    }
    
    private string LoadDataFromDatabase()
    {
        return "Data från databas";
    }
}
```

## Nullable Annotations

```csharp
public class UserService
{
    // Returnerar aldrig null
    public string GetUsername(int userId)
    {
        return $"User{userId}";
    }
    
    // Kan returnera null
    public User? FindUser(int userId)
    {
        if (userId < 0) return null;
        return new User { Id = userId };
    }
    
    // Parameter kan vara null
    public void UpdateEmail(User user, string? newEmail)
    {
        if (newEmail != null)
        {
            user.Email = newEmail;
        }
    }
}
```

## Null Checking

```csharp
public class ValidationService
{
    public void ValidateUser(User? user)
    {
        // Null check - compiler vet att user inte är null efter detta
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user));
        }
        
        // Säkert att använda user här
        Console.WriteLine(user.Name);
    }
    
    // Pattern matching
    public void ProcessUser(User? user)
    {
        if (user is null)
        {
            return;
        }
        
        // user är inte null här
        Console.WriteLine(user.Name);
    }
    
    // Negated pattern
    public void HandleUser(User? user)
    {
        if (user is not null)
        {
            Console.WriteLine(user.Name);
        }
    }
}
```

## ArgumentNullException.ThrowIfNull (C# 11)

```csharp
public class CustomerService
{
    // Kort syntax för null checking
    public void AddCustomer(Customer? customer)
    {
        ArgumentNullException.ThrowIfNull(customer);
        
        // customer är garanterat inte null här
        Console.WriteLine($"Adding {customer.Name}");
    }
    
    // Jämför med gammalt sätt:
    public void AddCustomerOldWay(Customer? customer)
    {
        if (customer == null)
        {
            throw new ArgumentNullException(nameof(customer));
        }
        
        Console.WriteLine($"Adding {customer.Name}");
    }
}
```

## Null Parameter Checking (!!) (C# 11)

```csharp
public class OrderService
{
    // !! kastar ArgumentNullException automatiskt
    public void ProcessOrder(Order order!!)
    {
        // order är garanterat inte null här
        Console.WriteLine($"Processing order {order.Id}");
    }
}
```

## Nullable Value Types

```csharp
public class Statistics
{
    // Nullable value type (fungerade innan C# 8)
    public int? Count { get; set; }
    public decimal? Average { get; set; }
    
    public void Calculate(List<int>? numbers)
    {
        if (numbers == null || numbers.Count == 0)
        {
            Count = null;
            Average = null;
            return;
        }
        
        Count = numbers.Count;
        Average = numbers.Average();
        
        // Null-conditional med value types
        decimal? result = Average?.ToString() != null ? Average : null;
        
        // HasValue och Value
        if (Count.HasValue)
        {
            Console.WriteLine($"Antal: {Count.Value}");
        }
    }
}
```

## Praktiskt Exempel

```csharp
#nullable enable

public record Customer
{
    public required string Name { get; init; }
    public string? Email { get; init; }
    public Address? Address { get; init; }
}

public record Address
{
    public required string Street { get; init; }
    public required string City { get; init; }
    public string? PostalCode { get; init; }
}

public class CustomerService
{
    public string GetShippingAddress(Customer? customer)
    {
        ArgumentNullException.ThrowIfNull(customer);
        
        // Null-safe navigation
        string street = customer.Address?.Street ?? "Ingen adress";
        string city = customer.Address?.City ?? "";
        string postal = customer.Address?.PostalCode ?? "";
        
        return $"{street}, {postal} {city}".Trim();
    }
    
    public void SendEmail(Customer customer)
    {
        if (customer.Email is null or "")
        {
            Console.WriteLine("Ingen email angiven");
            return;
        }
        
        Console.WriteLine($"Skickar email till {customer.Email}");
    }
}

// Användning
Customer customer = new Customer 
{ 
    Name = "Anna",
    Email = "anna@email.com",
    Address = new Address 
    { 
        Street = "Storgatan 1",
        City = "Stockholm"
    }
};

var service = new CustomerService();
Console.WriteLine(service.GetShippingAddress(customer));
service.SendEmail(customer);
```

## Enable Nullable i Projekt

```xml
<!-- I .csproj -->
<PropertyGroup>
    <Nullable>enable</Nullable>
</PropertyGroup>
```

!!! tip "Best Practices"
    - Aktivera nullable reference types i nya projekt
    - Använd `?` för att markera nullable references
    - Använd null-conditional (`?.`) istället för null checks
    - Använd null-coalescing (`??`) för default values
    - Validera parametrar med `ArgumentNullException.ThrowIfNull`

## Nästa lektion

Gå vidare till [Del 4: Praktik](../praktik/solid.md) för att lära dig SOLID-principer!
