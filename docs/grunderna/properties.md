# 3. Egenskaper (Properties)

Egenskaper lagrar information om objektet. Det finns olika sätt att definiera egenskaper i C#.

## Publika fält (inte rekommenderat)

```csharp
public class Person
{
    public string Name;
    public int Age;
}

Person person = new Person();
person.Name = "Anna";
person.Age = 25;
```

!!! warning "Varning"
    Publika fält ger ingen kontroll över data och bör undvikas.

## Properties med get och set (rekommenderat)

```csharp
public class Person
{
    private string name; // Privat fält
    private int age;
    
    // Property med get och set
    public string Name
    {
        get { return name; }
        set { name = value; }
    }
    
    public int Age
    {
        get { return age; }
        set 
        { 
            if (value >= 0) // Validering
            {
                age = value;
            }
        }
    }
}
```

## Auto-properties (enklare syntax)

```csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

// Användning
Person person = new Person();
person.Name = "Anna";
person.Age = 25;
```

## Read-only properties

```csharp
public class Person
{
    public string Name { get; private set; }
    
    public Person(string name)
    {
        Name = name;
    }
}

// Name kan bara sättas i konstruktorn
```

!!! success "Best Practice"
    Använd auto-properties för enkel kod och vanliga get/set med validering när du behöver kontroll.

## Nästa lektion

Lär dig om [Metoder](metoder.md).
