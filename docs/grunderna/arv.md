# 7. Arv (Inheritance)

Arv låter oss skapa nya klasser baserade på befintliga klasser. Den nya klassen ärver egenskaper och metoder från basklassen.

## Grundläggande arv

```csharp
// Basklass (Parent class)
public class Animal
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    public void Eat()
    {
        Console.WriteLine($"{Name} äter");
    }
    
    public void Sleep()
    {
        Console.WriteLine($"{Name} sover");
    }
}

// Subklass (Child class)
public class Dog : Animal
{
    public string Breed { get; set; }
    
    public void Bark()
    {
        Console.WriteLine($"{Name} skäller: Woof!");
    }
}

// Användning
Dog myDog = new Dog();
myDog.Name = "Buddy";
myDog.Age = 3;
myDog.Breed = "Golden Retriever";

myDog.Eat();   // Ärvd från Animal
myDog.Sleep(); // Ärvd från Animal
myDog.Bark();  // Finns bara i Dog
```

## Flera subklasser

```csharp
public class Cat : Animal
{
    public void Meow()
    {
        Console.WriteLine($"{Name} jamar: Mjau!");
    }
}

public class Bird : Animal
{
    public void Fly()
    {
        Console.WriteLine($"{Name} flyger");
    }
}

// Alla tre kan använda Eat() och Sleep()
Dog dog = new Dog { Name = "Buddy" };
Cat cat = new Cat { Name = "Whiskers" };
Bird bird = new Bird { Name = "Tweety" };

dog.Eat();
cat.Eat();
bird.Eat();
```

## Konstruktorer och arv

```csharp
public class Vehicle
{
    public string Brand { get; set; }
    
    public Vehicle(string brand)
    {
        Brand = brand;
        Console.WriteLine("Vehicle skapad");
    }
}

public class Car : Vehicle
{
    public int Doors { get; set; }
    
    // Anropa basklassens konstruktor med : base()
    public Car(string brand, int doors) : base(brand)
    {
        Doors = doors;
        Console.WriteLine("Car skapad");
    }
}

// När vi skapar en Car:
Car car = new Car("Volvo", 4);
// Output:
// Vehicle skapad
// Car skapad
```

!!! tip "Arv-hierarki"
    Tänk på arv som en "är en"-relation: En Dog "är ett" Animal, en Car "är ett" Vehicle.

## Nästa lektion

Lär dig om [Polymorfism](polymorfism.md).
