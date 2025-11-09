# 8. Polymorfism

Polymorfism betyder "många former". Det låter oss använda samma metod på olika sätt i olika klasser.

## Virtual och Override

```csharp
public class Animal
{
    public string Name { get; set; }
    
    // Virtual metod kan överskrivas
    public virtual void MakeSound()
    {
        Console.WriteLine("Djuret gör ett ljud");
    }
}

public class Dog : Animal
{
    // Override - ersätter basklassens metod
    public override void MakeSound()
    {
        Console.WriteLine($"{Name} säger: Woof!");
    }
}

public class Cat : Animal
{
    public override void MakeSound()
    {
        Console.WriteLine($"{Name} säger: Mjau!");
    }
}

public class Cow : Animal
{
    public override void MakeSound()
    {
        Console.WriteLine($"{Name} säger: Muuu!");
    }
}

// Användning - polymorfism i aktion
Animal[] animals = new Animal[]
{
    new Dog { Name = "Buddy" },
    new Cat { Name = "Whiskers" },
    new Cow { Name = "Bella" }
};

foreach (Animal animal in animals)
{
    animal.MakeSound();
}
// Output:
// Buddy säger: Woof!
// Whiskers säger: Mjau!
// Bella säger: Muuu!
```

## Base keyword

```csharp
public class Shape
{
    public virtual void Draw()
    {
        Console.WriteLine("Ritar en form");
    }
}

public class Circle : Shape
{
    public override void Draw()
    {
        base.Draw(); // Anropar basklassens metod först
        Console.WriteLine("Ritar en cirkel");
    }
}

Circle circle = new Circle();
circle.Draw();
// Output:
// Ritar en form
// Ritar en cirkel
```

!!! success "Kraftfull teknik"
    Polymorfism gör det möjligt att skriva flexibel kod som fungerar med olika typer av objekt på ett enhetligt sätt.

## Nästa lektion

Lär dig om [Abstraktion](abstraktion.md).
