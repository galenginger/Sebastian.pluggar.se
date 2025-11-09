# 17. C# 9-12 Features Overview

En översikt över de viktigaste moderna features i C# 9 till 12.

## Records (C# 9)

```csharp
// Record - immutable data class
public record Person(string Name, int Age);

// Användning
Person person1 = new Person("Anna", 25);
Person person2 = new Person("Anna", 25);

Console.WriteLine(person1 == person2); // true (value equality!)

// With-expression för att skapa kopia med ändringar
Person person3 = person1 with { Age = 26 };

Console.WriteLine(person1); // Person { Name = Anna, Age = 25 }
```

## Record med Properties

```csharp
public record Customer
{
    public string Name { get; init; }
    public string Email { get; init; }
    public DateTime RegisterDate { get; init; } = DateTime.Now;
    
    public void PrintInfo()
    {
        Console.WriteLine($"{Name} - {Email}");
    }
}

// Användning
Customer customer = new Customer 
{ 
    Name = "Anna", 
    Email = "anna@email.com" 
};

// customer.Name = "Erik"; // FEL! init-only
```

## Top-level Statements (C# 9)

```csharp
// Program.cs - ingen Main() behövs!
using System;

Console.WriteLine("Hello World!");

var person = new Person("Anna", 25);
person.Greet();

record Person(string Name, int Age)
{
    public void Greet() => Console.WriteLine($"Hej, jag är {Name}!");
}
```

## Target-typed New (C# 9)

```csharp
// Gammalt sätt
List<string> names = new List<string>();
Dictionary<string, int> ages = new Dictionary<string, int>();

// Nytt sätt - kortare!
List<string> names = new();
Dictionary<string, int> ages = new();
Person person = new("Anna", 25);
```

## Pattern Matching Improvements (C# 9-11)

```csharp
// Type patterns
public static string GetTypeInfo(object obj) => obj switch
{
    int => "Integer",
    string => "String",
    Person person => $"Person named {person.Name}",
    null => "Null",
    _ => "Unknown"
};

// Relational patterns
public static string GetAgeGroup(int age) => age switch
{
    < 0 => "Invalid",
    < 13 => "Child",
    < 20 => "Teenager",
    < 65 => "Adult",
    _ => "Senior"
};

// Logical patterns
public static bool IsValidAge(int age) => age is >= 0 and < 150;
public static bool IsWeekend(DayOfWeek day) => 
    day is DayOfWeek.Saturday or DayOfWeek.Sunday;
```

## List Patterns (C# 11)

```csharp
int[] numbers = { 1, 2, 3, 4, 5 };

string result = numbers switch
{
    [] => "Empty",
    [1] => "Single one",
    [1, 2] => "One and two",
    [1, 2, ..] => "Starts with 1, 2",
    [.., 5] => "Ends with 5",
    [1, .., 5] => "Starts with 1, ends with 5",
    _ => "Something else"
};
```

## Raw String Literals (C# 11)

```csharp
// Multi-line strings utan escape characters
string json = """
{
    "name": "Anna",
    "age": 25,
    "city": "Stockholm"
}
""";

// Med interpolation
string name = "Anna";
int age = 25;
string jsonTemplate = $"""
{
    "name": "{name}",
    "age": {age}
}
""";
```

## Required Members (C# 11)

```csharp
public class Person
{
    public required string Name { get; set; }
    public required int Age { get; set; }
    public string? City { get; set; } // Optional
}

// MÅSTE sätta Name och Age
Person person = new Person 
{ 
    Name = "Anna", 
    Age = 25 
}; // OK

// Detta fungerar INTE:
// Person person2 = new Person { Name = "Erik" }; // FEL! Age saknas
```

## Init-only Properties (C# 9)

```csharp
public class Person
{
    public string Name { get; init; }
    public int Age { get; init; }
}

Person person = new Person 
{ 
    Name = "Anna", 
    Age = 25 
};

// Detta fungerar INTE:
// person.Name = "Erik"; // FEL! Init-only
```

## Global Using (C# 10)

```csharp
// GlobalUsings.cs
global using System;
global using System.Collections.Generic;
global using System.Linq;

// Nu behöver alla andra filer inte dessa using statements!
```

## File-scoped Namespaces (C# 10)

```csharp
// Gammalt sätt
namespace Company.Project
{
    public class MyClass
    {
        // Indenterad kod
    }
}

// Nytt sätt - sparar indentering
namespace Company.Project;

public class MyClass
{
    // Ingen extra indentering!
}
```

!!! tip "Moderna C# Features"
    Dessa features gör koden:
    - Kortare och mer läsbar
    - Säkrare (init, required)
    - Mer expressiv (pattern matching)
    - Lättare att underhålla

## Nästa lektion

Lär dig mer om [Primary Constructors (C# 12)](primary-constructors.md).
