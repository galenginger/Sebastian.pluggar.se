# 19. Collection Expressions (C# 12)

Collection expressions ger en enhetlig syntax för att skapa collections i C# 12.

## Grundläggande Syntax

```csharp
// Arrays
int[] numbers = [1, 2, 3, 4, 5];
string[] names = ["Anna", "Erik", "Lisa"];

// Lists
List<int> numberList = [1, 2, 3, 4, 5];
List<string> nameList = ["Anna", "Erik", "Lisa"];

// Spans
Span<int> numberSpan = [1, 2, 3, 4, 5];
```

## Spread Operator (..)

```csharp
int[] first = [1, 2, 3];
int[] second = [4, 5, 6];

// Kombinera arrays
int[] combined = [..first, ..second]; // [1, 2, 3, 4, 5, 6]

// Lägg till element
int[] extended = [0, ..first, 7, 8]; // [0, 1, 2, 3, 7, 8]

// Funkar med Lists också
List<string> names1 = ["Anna", "Erik"];
List<string> names2 = ["Lisa", "Per"];
List<string> allNames = [..names1, ..names2, "Maria"];
```

## Praktiska Exempel

```csharp
public class ShoppingCart
{
    private List<string> items = [];
    
    public void AddItem(string item)
    {
        items = [..items, item]; // Lägg till item
    }
    
    public void AddMultipleItems(List<string> newItems)
    {
        items = [..items, ..newItems]; // Lägg till flera
    }
    
    public List<string> GetItems() => [..items]; // Returnera kopia
    
    public void RemoveItem(string item)
    {
        items = [..items.Where(i => i != item)];
    }
}

// Användning
ShoppingCart cart = new ShoppingCart();
cart.AddItem("Mjölk");
cart.AddItem("Bröd");
cart.AddMultipleItems(["Smör", "Ost", "Skinka"]);
```

## Med LINQ

```csharp
List<int> numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filtrera och skapa ny collection
List<int> evenNumbers = [..numbers.Where(n => n % 2 == 0)];

// Transformera
List<string> numberStrings = [..numbers.Select(n => n.ToString())];

// Kombinera operationer
List<int> result = [
    ..numbers.Where(n => n % 2 == 0).Select(n => n * 2)
];
```

## Jämförelse med Gammalt Sätt

```csharp
// Gammalt sätt
var list1 = new List<int> { 1, 2, 3 };
var list2 = new List<int> { 4, 5, 6 };
var combined = new List<int>();
combined.AddRange(list1);
combined.AddRange(list2);
combined.Add(7);

// Nytt sätt (C# 12)
List<int> list1 = [1, 2, 3];
List<int> list2 = [4, 5, 6];
List<int> combined = [..list1, ..list2, 7];
```

## Tom Collection

```csharp
// Tom array/list
int[] emptyArray = [];
List<string> emptyList = [];

// Konditionellt lägga till
bool includeExtra = true;
List<int> numbers = [1, 2, 3, ..(includeExtra ? [4, 5] : [])];
```

## Med Methods

```csharp
public class DataProcessor
{
    public List<int> ProcessData(List<int> input)
    {
        // Ta de första 3 och sista 2
        return [
            ..input.Take(3),
            ..input.TakeLast(2)
        ];
    }
    
    public List<string> CombineNames(params string[][] nameGroups)
    {
        List<string> result = [];
        
        foreach (var group in nameGroups)
        {
            result = [..result, ..group];
        }
        
        return result;
    }
}

// Användning
var processor = new DataProcessor();
var data = processor.ProcessData([1, 2, 3, 4, 5, 6, 7, 8]);
var names = processor.CombineNames(
    ["Anna", "Erik"], 
    ["Lisa", "Per"], 
    ["Maria"]
);
```

!!! success "Fördelar"
    - **Enhetlig syntax** - Samma syntax för alla collection-typer
    - **Kortare kod** - Mindre boilerplate
    - **Lättare att läsa** - Tydligare intent
    - **Spread operator** - Enkelt kombinera collections

## Nästa lektion

Lär dig om [Init-only Properties och Records](records.md).
