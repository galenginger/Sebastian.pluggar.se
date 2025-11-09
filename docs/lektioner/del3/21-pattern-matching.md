# 21. Pattern Matching

Pattern matching är en kraftfull teknik för att kontrollera och extrahera data från objekt.

## Type Patterns

```csharp
public void ProcessShape(object shape)
{
    if (shape is Circle circle)
    {
        Console.WriteLine($"Cirkel med radie {circle.Radius}");
    }
    else if (shape is Rectangle { Width: > 10, Height: > 10 } rect)
    {
        Console.WriteLine($"Stor rektangel: {rect.Width}x{rect.Height}");
    }
    else if (shape is null)
    {
        Console.WriteLine("Null shape");
    }
}
```

## Switch Expressions

```csharp
public decimal CalculateDiscount(Customer customer) => customer.Type switch
{
    CustomerType.Regular => 0,
    CustomerType.Silver => 0.05m,
    CustomerType.Gold => 0.10m,
    CustomerType.Platinum => 0.15m,
    _ => throw new ArgumentException("Okänd kundtyp")
};

// Med pattern guards
public string GetShippingCost(decimal orderTotal) => orderTotal switch
{
    < 100 => "59 kr",
    >= 100 and < 500 => "29 kr",
    >= 500 => "Gratis",
    _ => "Kontakta oss"
};
```

## Property Patterns

```csharp
public record Order(int Id, decimal Total, string Status);

public string GetOrderInfo(Order order) => order switch
{
    { Status: "Pending", Total: < 100 } => "Liten pending order",
    { Status: "Pending", Total: >= 100 } => "Stor pending order",
    { Status: "Shipped" } => "Order skickad",
    { Status: "Delivered" } => "Order levererad",
    _ => "Okänd status"
};

// Nested properties
public record Customer(string Name, Address Address);
public record Address(string City, string Country);

public bool IsSwedishCustomer(Customer customer) => customer switch
{
    { Address.Country: "Sweden" } => true,
    _ => false
};
```

## Relational och Logical Patterns

```csharp
public string GetTemperatureDescription(double temp) => temp switch
{
    < -20 => "Extremt kallt",
    < 0 => "Kallt",
    >= 0 and < 15 => "Svalt",
    >= 15 and < 25 => "Behagligt",
    >= 25 and < 35 => "Varmt",
    >= 35 => "Mycket varmt"
};

public bool IsWorkDay(DayOfWeek day) => 
    day is not (DayOfWeek.Saturday or DayOfWeek.Sunday);

public bool IsValidScore(int score) => score is >= 0 and <= 100;
```

## List Patterns (C# 11)

```csharp
public string AnalyzeArray(int[] array) => array switch
{
    [] => "Tom array",
    [var single] => $"Ett element: {single}",
    [var first, var second] => $"Två element: {first}, {second}",
    [var first, .., var last] => $"Flera element, första: {first}, sista: {last}",
    [1, 2, 3, ..] => "Börjar med 1, 2, 3",
    [.., 9, 10] => "Slutar med 9, 10",
    [1, .., 10] => "Börjar med 1, slutar med 10"
};

// Med villkor
public string CheckSequence(int[] numbers) => numbers switch
{
    [> 0, > 0, > 0] => "Tre positiva tal",
    [< 0, < 0, < 0] => "Tre negativa tal",
    [var a, var b, var c] when a + b + c == 0 => "Summan är noll",
    _ => "Annan sekvens"
};
```

## Positional Patterns

```csharp
public record Point(int X, int Y);

public string ClassifyPoint(Point point) => point switch
{
    (0, 0) => "Origo",
    (0, _) => "På Y-axeln",
    (_, 0) => "På X-axeln",
    (> 0, > 0) => "Kvadrant 1",
    (< 0, > 0) => "Kvadrant 2",
    (< 0, < 0) => "Kvadrant 3",
    (> 0, < 0) => "Kvadrant 4"
};

// Deconstruction
public void ProcessPoint(Point point)
{
    var (x, y) = point;
    Console.WriteLine($"X: {x}, Y: {y}");
}
```

## When Guards

```csharp
public decimal CalculatePrice(Product product, Customer customer) => product switch
{
    { Price: var p } when customer.IsPremium && p > 1000 => p * 0.8m,
    { Price: var p } when customer.IsPremium => p * 0.9m,
    { Price: var p } when p > 500 => p * 0.95m,
    { Price: var p } => p
};

public string GetDiscountMessage(decimal total, bool isFirstOrder) => (total, isFirstOrder) switch
{
    (> 1000, true) => "20% rabatt + gratis frakt!",
    (> 1000, false) => "Gratis frakt!",
    (> 500, true) => "15% rabatt!",
    (> 500, false) => "5% rabatt",
    (_, true) => "10% rabatt på första ordern!",
    _ => "Ingen rabatt"
};
```

## Var Pattern

```csharp
public void ProcessData(object data)
{
    if (data is var value && value != null)
    {
        Console.WriteLine($"Data finns: {value}");
    }
    
    // I switch
    var result = data switch
    {
        int n when n > 0 => $"Positivt tal: {n}",
        string s when !string.IsNullOrEmpty(s) => $"Text: {s}",
        var x => $"Annat: {x}"
    };
}
```

## Praktiskt Exempel

```csharp
public record PaymentMethod;
public record CreditCard(string Number, DateTime Expiry) : PaymentMethod;
public record Swish(string PhoneNumber) : PaymentMethod;
public record Invoice(string Reference) : PaymentMethod;

public class PaymentProcessor
{
    public string ProcessPayment(PaymentMethod payment, decimal amount) => payment switch
    {
        CreditCard { Expiry: var exp } when exp < DateTime.Now 
            => "Fel: Kort har gått ut",
        CreditCard card 
            => $"Betalar {amount} kr med kort som slutar på {card.Number[^4..]}",
        Swish { PhoneNumber: var phone } 
            => $"Skickar Swish-förfrågan till {phone}",
        Invoice { Reference: var ref } 
            => $"Skapar faktura {ref} för {amount} kr",
        null 
            => "Fel: Ingen betalmetod angiven",
        _ 
            => "Fel: Okänd betalmetod"
    };
}

// Användning
var processor = new PaymentProcessor();
Console.WriteLine(processor.ProcessPayment(
    new CreditCard("1234567812345678", DateTime.Now.AddYears(2)), 
    599
));
```

!!! success "Fördelar med Pattern Matching"
    - **Kortare kod** - Mindre boilerplate än if/else
    - **Säkrare** - Compiler varnar för saknade cases
    - **Tydligare** - Intent är mer explicit
    - **Kraftfullt** - Kan kombinera patterns på många sätt

## Nästa lektion

Lär dig om [Nullable Reference Types](22-nullable.md).
