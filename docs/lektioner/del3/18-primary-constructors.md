# 18. Primary Constructors (C# 12)

En av de mest användbara nya features i C# 12 är **Primary Constructors**.

## Vad är Primary Constructors?

Primary constructors låter dig definiera konstruktorparametrar direkt i klassdeklarationen.

## Grundläggande syntax

```csharp
// Gammalt sätt
public class PersonOld
{
    private readonly string name;
    private readonly int age;
    
    public PersonOld(string name, int age)
    {
        this.name = name;
        this.age = age;
    }
    
    public void Introduce()
    {
        Console.WriteLine($"Hej, jag är {name}, {age} år");
    }
}

// Nytt sätt (C# 12) - mycket kortare!
public class Person(string name, int age)
{
    public void Introduce()
    {
        Console.WriteLine($"Hej, jag är {name}, {age} år");
    }
}

// Användning är samma
Person person = new Person("Anna", 25);
person.Introduce();
```

## Med Properties

```csharp
public class Customer(string name, string email)
{
    // Kan lägga till properties
    public string Name { get; } = name;
    public string Email { get; } = email;
    public DateTime RegisterDate { get; } = DateTime.Now;
    
    // Kan använda parametrarna direkt
    public void SendWelcomeEmail()
    {
        Console.WriteLine($"Skickar email till {email}");
    }
}
```

## Med Validering

```csharp
public class BankAccount(string accountNumber, decimal initialBalance)
{
    public string AccountNumber { get; } = 
        !string.IsNullOrEmpty(accountNumber) 
            ? accountNumber 
            : throw new ArgumentException("Kontonummer krävs");
    
    private decimal balance = 
        initialBalance >= 0 
            ? initialBalance 
            : throw new ArgumentException("Saldo kan inte vara negativt");
    
    public decimal Balance => balance;
    
    public void Deposit(decimal amount)
    {
        balance += amount;
        Console.WriteLine($"Satte in {amount} kr på konto {accountNumber}");
    }
}
```

## Dependency Injection

Primary constructors är perfekta för dependency injection!

```csharp
public interface ILogger
{
    void Log(string message);
}

public class ConsoleLogger : ILogger
{
    public void Log(string message) => Console.WriteLine(message);
}

// Primary constructor perfekt för DI!
public class OrderService(ILogger logger)
{
    public void ProcessOrder(int orderId)
    {
        logger.Log($"Processing order {orderId}");
        // Process order logic
    }
}

// Användning
ILogger logger = new ConsoleLogger();
OrderService service = new OrderService(logger);
service.ProcessOrder(123);
```

!!! success "Fördelar"
    - **Kortare kod** - Mindre boilerplate
    - **Tydligare intent** - Dependencies syns direkt i deklarationen
    - **Immutability** - Parameters är readonly by default

## Nästa lektion

Lär dig om [Collection Expressions](19-collection-expressions.md).
