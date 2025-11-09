# 11. Static vs Instance

En av de viktigaste distinktionerna i OOP är skillnaden mellan static och instance members.

## Instance Members

**Instance members** tillhör specifika objekt. Varje objekt har sina egna värden.

```csharp
public class Person
{
    // Instance property - varje objekt har sitt eget värde
    public string Name { get; set; }
    public int Age { get; set; }
    
    // Instance method - jobbar med specifikt objekt
    public void SayHello()
    {
        Console.WriteLine($"Hej, jag är {Name}");
    }
}

Person person1 = new Person { Name = "Anna" };
Person person2 = new Person { Name = "Erik" };

person1.SayHello(); // Hej, jag är Anna
person2.SayHello(); // Hej, jag är Erik
```

## Static Members

**Static members** delas av alla instanser av klassen.

```csharp
public class Counter
{
    // Static - delas av alla instanser
    public static int TotalCount = 0;
    
    // Instance - unikt för varje objekt
    public int InstanceCount = 0;
    
    public Counter()
    {
        TotalCount++;     // Ökar för ALLA objekt
        InstanceCount++;  // Bara för detta objekt
    }
    
    // Static method
    public static void ResetTotal()
    {
        TotalCount = 0;
    }
}

// Användning
Counter c1 = new Counter();
Counter c2 = new Counter();
Counter c3 = new Counter();

Console.WriteLine(Counter.TotalCount);    // 3 (delas av alla)
Console.WriteLine(c1.InstanceCount);      // 1
Console.WriteLine(c2.InstanceCount);      // 1

Counter.ResetTotal(); // Anropas på klassen, inte objektet
```

## Static Klasser

En **static class** kan bara innehålla static members och kan inte instansieras.

```csharp
public static class MathHelper
{
    public static double Pi => 3.14159;
    
    public static double CalculateCircleArea(double radius)
    {
        return Pi * radius * radius;
    }
    
    public static int Max(int a, int b)
    {
        return a > b ? a : b;
    }
}

// Användning - ingen instansiering möjlig
double area = MathHelper.CalculateCircleArea(5);
int max = MathHelper.Max(10, 20);

// Detta fungerar INTE:
// MathHelper helper = new MathHelper(); // FEL!
```

## Praktiskt Exempel

```csharp
public class DatabaseConnection
{
    private static string connectionString = "Server=localhost;";
    private static int activeConnections = 0;
    
    public string UserId { get; set; }
    
    public DatabaseConnection(string userId)
    {
        UserId = userId;
        activeConnections++;
    }
    
    public static string GetConnectionString()
    {
        return connectionString;
    }
    
    public static int GetActiveConnections()
    {
        return activeConnections;
    }
    
    public void Connect()
    {
        Console.WriteLine($"{UserId} ansluter med: {connectionString}");
    }
}
```

!!! tip "När använda static?"
    Använd static för:
    - Utility/helper metoder
    - Delade resurser
    - Konstanter
    - Factory methods

## Nästa lektion

Lär dig om [Collections och Generics](collections.md).
