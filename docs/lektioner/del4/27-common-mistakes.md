# 27. Vanliga misstag i OOP

Lär av vanliga fallgropar och hur du undviker dem.

## 1. God Object Anti-Pattern

### ❌ Fel: En klass som gör ALLT

```csharp
public class GameManager
{
    // Hanterar rendering
    public void DrawScreen() { }
    
    // Hanterar input
    public void HandleInput() { }
    
    // Hanterar AI
    public void UpdateEnemies() { }
    
    // Hanterar ljud
    public void PlaySound() { }
    
    // Hanterar saves
    public void SaveGame() { }
    public void LoadGame() { }
    
    // Hanterar networking
    public void ConnectToServer() { }
    
    // ... 500 rader till
}
```

### ✅ Rätt: Dela upp ansvaret

```csharp
public class Renderer
{
    public void DrawScreen() { }
}

public class InputHandler
{
    public void HandleInput() { }
}

public class AISystem
{
    public void UpdateEnemies() { }
}

public class AudioManager
{
    public void PlaySound(string soundName) { }
}

public class SaveSystem
{
    public void SaveGame() { }
    public void LoadGame() { }
}
```

## 2. Överanvändning av Inheritance

### ❌ Fel: Djup arvshierarki

```csharp
public class Animal { }
public class Mammal : Animal { }
public class Dog : Mammal { }
public class Poodle : Dog { }
public class ToyPoodle : Poodle { }
// Svårt att underhålla och förstå!
```

### ✅ Rätt: Använd komposition

```csharp
public interface IMovable
{
    void Move();
}

public interface IMakeSound
{
    void MakeSound();
}

public class Dog : IMovable, IMakeSound
{
    private MovementBehavior movement;
    private SoundBehavior sound;
    
    public void Move() => movement.Execute();
    public void MakeSound() => sound.Execute();
}
```

## 3. Primitive Obsession

### ❌ Fel: Använd primitiva typer för allt

```csharp
public class Order
{
    public string CustomerEmail { get; set; } // Ingen validering!
    public string PhoneNumber { get; set; }   // Ingen formattering!
    public decimal Price { get; set; }        // Negativa priser?
}

public void SendEmail(string email)
{
    // email kan vara null, tom, eller ogiltig
}
```

### ✅ Rätt: Skapa value objects

```csharp
public record Email
{
    public string Value { get; }
    
    public Email(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            throw new ArgumentException("Ogiltig email");
        Value = email;
    }
}

public record Price
{
    public decimal Amount { get; }
    
    public Price(decimal amount)
    {
        if (amount < 0)
            throw new ArgumentException("Pris kan inte vara negativt");
        Amount = amount;
    }
}

public class Order
{
    public Email CustomerEmail { get; set; }
    public Price TotalPrice { get; set; }
}
```

## 4. Broken Encapsulation

### ❌ Fel: Exponera intern state

```csharp
public class BankAccount
{
    public decimal Balance { get; set; } // Kan sättas direkt!
}

// Problem:
var account = new BankAccount();
account.Balance = -1000; // Ingen validering!
```

### ✅ Rätt: Skydda state med metoder

```csharp
public class BankAccount
{
    public decimal Balance { get; private set; }
    
    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Beloppet måste vara positivt");
        Balance += amount;
    }
    
    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Beloppet måste vara positivt");
        if (amount > Balance)
            throw new InvalidOperationException("Inte tillräckligt med pengar");
        Balance -= amount;
    }
}
```

## 5. Null Reference Hell

### ❌ Fel: Ingen null-hantering

```csharp
public class OrderProcessor
{
    public void ProcessOrder(Order order)
    {
        var customerName = order.Customer.Name; // NullReferenceException?
        var street = order.ShippingAddress.Street; // NullReferenceException?
        
        SendEmail(order.Customer.Email); // NullReferenceException?
    }
}
```

### ✅ Rätt: Hantera null explicit

```csharp
public class OrderProcessor
{
    public void ProcessOrder(Order? order)
    {
        ArgumentNullException.ThrowIfNull(order);
        
        var customerName = order.Customer?.Name ?? "Okänd kund";
        
        if (order.ShippingAddress is null)
        {
            throw new InvalidOperationException("Leveransadress saknas");
        }
        
        var street = order.ShippingAddress.Street;
        
        if (!string.IsNullOrEmpty(order.Customer?.Email))
        {
            SendEmail(order.Customer.Email);
        }
    }
}
```

## 6. Tight Coupling

### ❌ Fel: Direkta beroenden

```csharp
public class OrderService
{
    public void CreateOrder(Order order)
    {
        var db = new SqlDatabase(); // Tight coupling!
        db.Save(order);
        
        var emailService = new SmtpEmailService(); // Tight coupling!
        emailService.Send("Order created");
    }
}
```

### ✅ Rätt: Dependency Injection

```csharp
public interface IDatabase
{
    void Save<T>(T entity);
}

public interface IEmailService
{
    void Send(string message);
}

public class OrderService
{
    private readonly IDatabase database;
    private readonly IEmailService emailService;
    
    public OrderService(IDatabase database, IEmailService emailService)
    {
        this.database = database;
        this.emailService = emailService;
    }
    
    public void CreateOrder(Order order)
    {
        database.Save(order);
        emailService.Send("Order created");
    }
}
```

## 7. Anemic Domain Model

### ❌ Fel: Bara data, ingen logik

```csharp
public class ShoppingCart
{
    public List<CartItem> Items { get; set; } = new();
    public decimal Total { get; set; }
}

public class ShoppingCartService
{
    public void AddItem(ShoppingCart cart, CartItem item)
    {
        cart.Items.Add(item);
        cart.Total += item.Price;
    }
    
    public void RemoveItem(ShoppingCart cart, CartItem item)
    {
        cart.Items.Remove(item);
        cart.Total -= item.Price;
    }
}
```

### ✅ Rätt: Rich domain model

```csharp
public class ShoppingCart
{
    private List<CartItem> items = new();
    
    public IReadOnlyList<CartItem> Items => items.AsReadOnly();
    
    public decimal Total => items.Sum(i => i.Price * i.Quantity);
    
    public void AddItem(CartItem item)
    {
        ArgumentNullException.ThrowIfNull(item);
        
        var existing = items.FirstOrDefault(i => i.ProductId == item.ProductId);
        if (existing != null)
        {
            existing.IncreaseQuantity(item.Quantity);
        }
        else
        {
            items.Add(item);
        }
    }
    
    public void RemoveItem(int productId)
    {
        var item = items.FirstOrDefault(i => i.ProductId == productId);
        if (item != null)
        {
            items.Remove(item);
        }
    }
    
    public void Clear()
    {
        items.Clear();
    }
}
```

## 8. Magic Numbers och Strings

### ❌ Fel: Hårdkodade värden

```csharp
public class DiscountCalculator
{
    public decimal Calculate(decimal price, string customerType)
    {
        if (customerType == "gold")
            return price * 0.8m;
        else if (customerType == "silver")
            return price * 0.9m;
        else
            return price;
    }
}
```

### ✅ Rätt: Konstanter och enums

```csharp
public enum CustomerType
{
    Regular,
    Silver,
    Gold,
    Platinum
}

public class DiscountCalculator
{
    private const decimal GoldDiscount = 0.2m;
    private const decimal SilverDiscount = 0.1m;
    private const decimal PlatinumDiscount = 0.25m;
    
    public decimal Calculate(decimal price, CustomerType customerType)
    {
        return customerType switch
        {
            CustomerType.Gold => price * (1 - GoldDiscount),
            CustomerType.Silver => price * (1 - SilverDiscount),
            CustomerType.Platinum => price * (1 - PlatinumDiscount),
            _ => price
        };
    }
}
```

## 9. Stora metoder

### ❌ Fel: En metod gör allt

```csharp
public void ProcessOrder(Order order)
{
    // Validera (50 rader)
    if (order == null) throw new Exception();
    if (order.Items.Count == 0) throw new Exception();
    // ... 48 rader till
    
    // Beräkna pris (30 rader)
    decimal total = 0;
    foreach (var item in order.Items)
    {
        // ... komplex logik
    }
    
    // Spara (20 rader)
    using var connection = new SqlConnection();
    // ... SQL-kod
    
    // Skicka email (25 rader)
    var smtp = new SmtpClient();
    // ... email-kod
}
```

### ✅ Rätt: Dela upp i mindre metoder

```csharp
public void ProcessOrder(Order order)
{
    ValidateOrder(order);
    decimal total = CalculateTotal(order);
    SaveOrder(order, total);
    SendConfirmationEmail(order);
}

private void ValidateOrder(Order order)
{
    ArgumentNullException.ThrowIfNull(order);
    if (order.Items.Count == 0)
        throw new InvalidOperationException("Ordern är tom");
}

private decimal CalculateTotal(Order order)
{
    return order.Items.Sum(i => i.Price * i.Quantity);
}

private void SaveOrder(Order order, decimal total)
{
    // Spara logik
}

private void SendConfirmationEmail(Order order)
{
    // Email logik
}
```

## 10. Catch-all Exception Handling

### ❌ Fel: Fånga allt

```csharp
try
{
    ProcessOrder(order);
}
catch (Exception ex)
{
    Console.WriteLine("Något gick fel");
    // Svårt att veta vad som hände!
}
```

### ✅ Rätt: Specifika exceptions

```csharp
try
{
    ProcessOrder(order);
}
catch (ArgumentNullException ex)
{
    Console.WriteLine("Order saknas");
    // Logga ex
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"Ogiltig operation: {ex.Message}");
}
catch (DatabaseException ex)
{
    Console.WriteLine("Databasfel");
    // Retry logic?
}
```

!!! warning "Sammanfattning: Undvik dessa misstag"
    1. God Object - Dela upp stora klasser
    2. Deep Inheritance - Använd composition
    3. Primitive Obsession - Skapa value objects
    4. Broken Encapsulation - Använd private setters
    5. Null Hell - Hantera null explicit
    6. Tight Coupling - Använd DI
    7. Anemic Model - Lägg logik i domain objects
    8. Magic Numbers - Använd konstanter/enums
    9. Stora metoder - Bryt ner i mindre delar
    10. Catch-all - Fånga specifika exceptions

## Nästa lektion

Slutligen, se [Projekt och exempel](28-projects.md) för komplett kod!
