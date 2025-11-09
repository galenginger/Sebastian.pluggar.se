# 20. Init-only Properties och Records

Init-only properties och records gör det enkelt att skapa immutable data-klasser.

## Init-only Properties (C# 9)

```csharp
public class Person
{
    public string Name { get; init; }
    public int Age { get; init; }
    
    // Kan bara sättas vid skapande eller i konstruktor
}

// Användning
Person person = new Person 
{ 
    Name = "Anna", 
    Age = 25 
};

// Detta fungerar INTE:
// person.Name = "Erik"; // FEL! Init-only
```

## Records för Value Objects

```csharp
// Positional record
public record Point(int X, int Y);

// Användning
Point p1 = new Point(10, 20);
Point p2 = new Point(10, 20);

Console.WriteLine(p1 == p2); // true (value equality)
Console.WriteLine(p1);        // Point { X = 10, Y = 20 }

// Deconstruction
var (x, y) = p1;
Console.WriteLine($"X: {x}, Y: {y}");
```

## Record med Metoder

```csharp
public record Temperature(double Celsius)
{
    public double Fahrenheit => Celsius * 9 / 5 + 32;
    public double Kelvin => Celsius + 273.15;
    
    public bool IsFreezing => Celsius <= 0;
    public bool IsBoiling => Celsius >= 100;
    
    public void Display()
    {
        Console.WriteLine($"{Celsius}°C = {Fahrenheit}°F = {Kelvin}K");
    }
}

// Användning
Temperature temp = new Temperature(25);
temp.Display(); // 25°C = 77°F = 298.15K
Console.WriteLine(temp.IsFreezing); // false
```

## Record Inheritance

```csharp
public record Person(string Name, int Age);
public record Student(string Name, int Age, string School) : Person(Name, Age);
public record Teacher(string Name, int Age, string Subject) : Person(Name, Age);

// Användning
Student student = new Student("Anna", 20, "KTH");
Teacher teacher = new Teacher("Erik", 45, "Matematik");

// Pattern matching
string GetInfo(Person person) => person switch
{
    Student s => $"Student {s.Name} på {s.School}",
    Teacher t => $"Lärare {t.Name} i {t.Subject}",
    _ => $"Person {person.Name}"
};
```

## With-expressions

```csharp
public record Product(string Name, decimal Price, int Stock);

Product original = new Product("Laptop", 10000, 5);

// Skapa kopior med ändringar
Product discounted = original with { Price = 8000 };
Product restocked = original with { Stock = 10 };
Product renamed = original with { Name = "Gaming Laptop" };

// Ändra flera properties
Product updated = original with 
{ 
    Price = 9000, 
    Stock = 8 
};

Console.WriteLine(original); // Laptop, 10000 kr, 5 st
Console.WriteLine(updated);  // Laptop, 9000 kr, 8 st
```

## Record Class vs Record Struct (C# 10)

```csharp
// Record class (default) - reference type
public record class PersonClass(string Name, int Age);

// Record struct - value type
public record struct PersonStruct(string Name, int Age);

// Användning
PersonClass c1 = new PersonClass("Anna", 25);
PersonClass c2 = c1; // Same reference
c2 = c2 with { Age = 26 }; // c1 påverkas INTE

PersonStruct s1 = new PersonStruct("Erik", 30);
PersonStruct s2 = s1; // Copy
s2 = s2 with { Age = 31 }; // s1 påverkas INTE
```

## Readonly vs Init

```csharp
public class PersonWithReadonly
{
    // Readonly - kan bara sättas i konstruktor
    public readonly string Name;
    
    public PersonWithReadonly(string name)
    {
        Name = name;
    }
}

public class PersonWithInit
{
    // Init - kan sättas i object initializer OCH konstruktor
    public string Name { get; init; }
    
    public PersonWithInit() { }
    
    public PersonWithInit(string name)
    {
        Name = name;
    }
}

// Användning
var person1 = new PersonWithInit { Name = "Anna" }; // OK
var person2 = new PersonWithInit("Erik"); // OK
```

## Praktiskt Exempel

```csharp
// Immutable configuration
public record DatabaseConfig
{
    public required string ConnectionString { get; init; }
    public required string DatabaseName { get; init; }
    public int Timeout { get; init; } = 30;
    public bool EnableRetry { get; init; } = true;
}

// Användning
DatabaseConfig config = new DatabaseConfig
{
    ConnectionString = "Server=localhost;",
    DatabaseName = "MyDb"
};

// Skapa variant för produktion
DatabaseConfig prodConfig = config with
{
    ConnectionString = "Server=prod.server.com;",
    Timeout = 60
};
```

## Records för DTOs

```csharp
// Data Transfer Objects
public record CustomerDto(
    int Id,
    string Name,
    string Email,
    DateTime CreatedAt
);

public record OrderDto(
    int OrderId,
    CustomerDto Customer,
    List<OrderItemDto> Items,
    decimal Total
);

public record OrderItemDto(
    string ProductName,
    int Quantity,
    decimal Price
);
```

!!! tip "När använda Records?"
    Använd records för:
    - **Value objects** - Objekt definierade av deras värden
    - **DTOs** - Data Transfer Objects
    - **Immutable data** - Data som inte ska ändras
    - **Configuration** - Settings och config

## Nästa lektion

Lär dig om [Pattern Matching](pattern-matching.md).
