# 10. Interface

Ett interface är ett kontrakt som definierar vilka metoder en klass måste implementera. Till skillnad från abstrakta klasser kan en klass implementera flera interface.

## Grundläggande interface

```csharp
// Interface - definierar kontrakt
public interface IAnimal
{
    string Name { get; set; }
    void MakeSound();
    void Eat();
}

// Implementera interface
public class Dog : IAnimal
{
    public string Name { get; set; }
    
    public void MakeSound()
    {
        Console.WriteLine("Woof!");
    }
    
    public void Eat()
    {
        Console.WriteLine($"{Name} äter hundmat");
    }
}

public class Cat : IAnimal
{
    public string Name { get; set; }
    
    public void MakeSound()
    {
        Console.WriteLine("Mjau!");
    }
    
    public void Eat()
    {
        Console.WriteLine($"{Name} äter kattmat");
    }
}
```

## Flera interface

```csharp
public interface IFlyable
{
    void Fly();
}

public interface ISwimmable
{
    void Swim();
}

// En klass kan implementera flera interface
public class Duck : IAnimal, IFlyable, ISwimmable
{
    public string Name { get; set; }
    
    public void MakeSound()
    {
        Console.WriteLine("Kvack!");
    }
    
    public void Eat()
    {
        Console.WriteLine($"{Name} äter");
    }
    
    public void Fly()
    {
        Console.WriteLine($"{Name} flyger");
    }
    
    public void Swim()
    {
        Console.WriteLine($"{Name} simmar");
    }
}

// Användning
Duck duck = new Duck { Name = "Donald" };
duck.MakeSound();
duck.Fly();
duck.Swim();
```

## Interface vs Abstrakt klass

### Interface:
- Kan implementera flera
- Bara metodsignaturer (ingen implementation)
- Ingen konstruktor
- Alla medlemmar är public

### Abstrakt klass:
- Kan bara ärva från en
- Kan ha både abstrakta och konkreta metoder
- Kan ha konstruktor
- Kan ha olika åtkomstnivåer

!!! tip "När använda vad?"
    Använd **interface** för att definiera vad en klass kan göra. Använd **abstrakt klass** för att dela gemensam kod mellan relaterade klasser.

## Sammanfattning

Du har nu lärt dig alla grundläggande OOP-koncept! Fortsätt med de [Praktiska exemplen](../material/index.md) för att se hur allt fungerar tillsammans.
