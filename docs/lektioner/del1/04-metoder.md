# 4. Metoder

Metoder är handlingar som objektet kan utföra. De definierar beteenden.

## Grundläggande metoder

```csharp
public class Calculator
{
    // Metod utan returvärde (void)
    public void PrintWelcome()
    {
        Console.WriteLine("Välkommen till räknaren!");
    }
    
    // Metod med returvärde
    public int Add(int a, int b)
    {
        return a + b;
    }
    
    // Metod med flera parametrar
    public double Calculate(double num1, double num2, string operation)
    {
        if (operation == "add")
        {
            return num1 + num2;
        }
        else if (operation == "subtract")
        {
            return num1 - num2;
        }
        return 0;
    }
}

// Användning
Calculator calc = new Calculator();
calc.PrintWelcome(); // Output: Välkommen till räknaren!
int result = calc.Add(5, 3); // result = 8
```

## Metoder med objekt som parameter

```csharp
public class Dog
{
    public string Name { get; set; }
    
    public void Greet(Dog otherDog)
    {
        Console.WriteLine($"{Name} hälsar på {otherDog.Name}");
    }
}

Dog dog1 = new Dog { Name = "Buddy" };
Dog dog2 = new Dog { Name = "Max" };
dog1.Greet(dog2); // Output: Buddy hälsar på Max
```

!!! tip "Metodnamn"
    Använd verb för metodnamn (Add, Calculate, Print) för att tydligt visa vad de gör.

## Nästa lektion

Lär dig om [Konstruktorer](05-konstruktorer.md).
