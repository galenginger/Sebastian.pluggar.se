# 2. Klasser och Objekt

## Vad är skillnaden?

En **klass** är en ritning eller mall. Ett **objekt** är en specifik instans av den klassen.

### Analogier:
- **Klass** = Recept, **Objekt** = Den faktiska kakan
- **Klass** = Husbluprint, **Objekt** = Det byggda huset

## Grundläggande syntax

```csharp
// Definition av en klass
public class Car
{
    // Egenskaper (properties)
    public string Brand;
    public string Color;
    public int Speed;
    
    // Metod (method)
    public void Start()
    {
        Console.WriteLine("Bilen startar!");
    }
}

// Skapa objekt från klassen
Car myCar = new Car();
myCar.Brand = "Volvo";
myCar.Color = "Blå";
myCar.Speed = 0;

myCar.Start(); // Output: Bilen startar!
```

### Förklaring:
- `public class Car` - Skapar en ny klass som heter Car
- `myCar` - Ett objekt (instans) av klassen Car
- `new Car()` - Skapar ett nytt objekt

## Flera objekt från samma klass

```csharp
Car car1 = new Car();
car1.Brand = "Volvo";
car1.Color = "Blå";

Car car2 = new Car();
car2.Brand = "BMW";
car2.Color = "Röd";

// Två olika objekt med olika värden
```

!!! tip "Tips"
    Varje objekt är oberoende och har sina egna värden för egenskaperna!

## Nästa lektion

Lär dig mer om [Egenskaper (Properties)](03-properties.md).
