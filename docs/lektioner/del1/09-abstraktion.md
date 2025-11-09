# 9. Abstraktion

Abstraktion handlar om att dölja komplexa detaljer och bara visa det väsentliga. Abstrakta klasser kan inte instansieras direkt.

## Abstrakt klass

```csharp
// Abstrakt klass - kan inte skapa objekt direkt
public abstract class Shape
{
    public string Color { get; set; }
    
    // Abstrakt metod - MÅSTE implementeras i subklasser
    public abstract double CalculateArea();
    
    // Vanlig metod - ärvs av subklasser
    public void DisplayInfo()
    {
        Console.WriteLine($"Form med färg: {Color}");
        Console.WriteLine($"Area: {CalculateArea()}");
    }
}

public class Circle : Shape
{
    public double Radius { get; set; }
    
    // Måste implementera abstrakt metod
    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }
    
    public override double CalculateArea()
    {
        return Width * Height;
    }
}

// Användning
Circle circle = new Circle { Color = "Röd", Radius = 5 };
Rectangle rect = new Rectangle { Color = "Blå", Width = 4, Height = 6 };

circle.DisplayInfo();
rect.DisplayInfo();

// Detta fungerar INTE:
// Shape shape = new Shape(); // FEL! Kan inte instansiera abstrakt klass
```

## När använda abstrakta klasser?

Använd abstrakt klass när:

- Du vill dela kod mellan relaterade klasser
- Du vill tvinga subklasser att implementera vissa metoder
- Du vill ha en bas som aldrig ska användas direkt

!!! warning "Viktigt"
    En abstrakt klass kan innehålla både abstrakta metoder (utan implementation) och vanliga metoder (med implementation).

## Nästa lektion

Lär dig om [Interface](10-interface.md).
