# 23. SOLID-principer

SOLID är fem principer för objektorienterad design som hjälper oss skriva bättre, mer underhållbar kod.

## S - Single Responsibility Principle

**En klass ska bara ha ETT ansvarsområde.**

```csharp
// DÅLIGT - gör för mycket
public class User
{
    public void SaveToDatabase() { }
    public void SendEmail() { }
    public void ValidateData() { }
    public void GenerateReport() { }
}

// BRA - separerade ansvarsområden
public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
}

public class UserRepository
{
    public void Save(User user) { /* Database logic */ }
}

public class EmailService
{
    public void SendWelcomeEmail(User user) { /* Email logic */ }
}

public class UserValidator
{
    public bool Validate(User user) { /* Validation logic */ return true; }
}
```

## O - Open/Closed Principle

**Öppen för utökning, stängd för modifiering.**

```csharp
public abstract class PaymentMethod
{
    public abstract void ProcessPayment(decimal amount);
}

public class CreditCardPayment : PaymentMethod
{
    public override void ProcessPayment(decimal amount)
    {
        Console.WriteLine($"Betalar {amount} kr med kreditkort");
    }
}

public class SwishPayment : PaymentMethod
{
    public override void ProcessPayment(decimal amount)
    {
        Console.WriteLine($"Betalar {amount} kr med Swish");
    }
}

// Lägg till ny betalmetod utan att ändra existing kod
public class PayPalPayment : PaymentMethod
{
    public override void ProcessPayment(decimal amount)
    {
        Console.WriteLine($"Betalar {amount} kr med PayPal");
    }
}
```

## L - Liskov Substitution Principle

**Subklasser ska kunna ersätta sina basklasser.**

```csharp
public class Bird
{
    public virtual void Move()
    {
        Console.WriteLine("Fågeln rör sig");
    }
}

public class Sparrow : Bird
{
    public override void Move()
    {
        Console.WriteLine("Sparven flyger");
    }
}

public class Penguin : Bird
{
    public override void Move()
    {
        Console.WriteLine("Pingvinen simmar/går");
    }
}

// Alla fungerar som Bird
void MoveBird(Bird bird)
{
    bird.Move(); // Funkar för alla subklasser
}
```

## I - Interface Segregation Principle

**Många små interface istället för stora.**

```csharp
// DÅLIGT - för stort interface
public interface IWorker
{
    void Work();
    void Eat();
    void Sleep();
}

// BRA - separerade interface
public interface IWorkable
{
    void Work();
}

public interface IEatable
{
    void Eat();
}

public class Human : IWorkable, IEatable
{
    public void Work() => Console.WriteLine("Working");
    public void Eat() => Console.WriteLine("Eating");
}

public class Robot : IWorkable
{
    public void Work() => Console.WriteLine("Working");
    // Behöver inte Eat
}
```

## D - Dependency Inversion Principle

**Beroenden på abstraktioner, inte konkreta klasser.**

```csharp
// Abstraktion
public interface INotificationService
{
    void Send(string message);
}

// Konkreta implementationer
public class EmailNotification : INotificationService
{
    public void Send(string message)
    {
        Console.WriteLine($"Email: {message}");
    }
}

public class SmsNotification : INotificationService
{
    public void Send(string message)
    {
        Console.WriteLine($"SMS: {message}");
    }
}

// High-level module beror på abstraktion
public class OrderService(INotificationService notificationService)
{
    public void PlaceOrder()
    {
        // Order logic
        notificationService.Send("Order placerad!");
    }
}

// Användning - lätt att byta implementation
var emailService = new OrderService(new EmailNotification());
var smsService = new OrderService(new SmsNotification());
```

!!! tip "Kom ihåg"
    SOLID gör din kod:
    - Lättare att förstå
    - Enklare att testa
    - Mer flexibel
    - Mindre motståndskraftig mot förändringar

## Nästa lektion

Lär dig om [Design Patterns](24-design-patterns.md).
