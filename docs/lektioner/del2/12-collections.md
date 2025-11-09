# 12. Collections och Generics

Collections låter oss lagra flera objekt. Generics gör dem typsäkra.

## List<T> - Den vanligaste collectionen

```csharp
// Skapa lista
List<string> names = new List<string>();
names.Add("Anna");
names.Add("Erik");
names.Add("Lisa");

// Eller med collection initializer
List<string> cities = new List<string> { "Stockholm", "Göteborg", "Malmö" };

// Vanliga operationer
cities.Remove("Malmö");
cities.Insert(0, "Uppsala");
bool hasStockholm = cities.Contains("Stockholm");
int count = cities.Count;

// Loopa igenom
foreach (string name in names)
{
    Console.WriteLine(name);
}
```

## List med objekt

```csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

List<Person> people = new List<Person>
{
    new Person { Name = "Anna", Age = 25 },
    new Person { Name = "Erik", Age = 30 },
    new Person { Name = "Lisa", Age = 22 }
};

// LINQ queries
var adults = people.Where(p => p.Age >= 18).ToList();
var sorted = people.OrderBy(p => p.Age).ToList();
var names = people.Select(p => p.Name).ToList();
```

## Dictionary<TKey, TValue>

```csharp
// Nyckel-värde par
Dictionary<string, int> ages = new Dictionary<string, int>
{
    { "Anna", 25 },
    { "Erik", 30 },
    { "Lisa", 22 }
};

// Lägga till
ages["Per"] = 28;

// Hämta värde
int annaAge = ages["Anna"];

// Säkert hämta värde
if (ages.TryGetValue("Lisa", out int lisaAge))
{
    Console.WriteLine($"Lisa är {lisaAge} år");
}

// Loopa
foreach (var (name, age) in ages)
{
    Console.WriteLine($"{name} är {age} år");
}
```

## Queue och Stack

```csharp
// Queue - First In First Out (FIFO)
Queue<string> queue = new Queue<string>();
queue.Enqueue("Första");
queue.Enqueue("Andra");
string first = queue.Dequeue();  // "Första"

// Stack - Last In First Out (LIFO)
Stack<string> stack = new Stack<string>();
stack.Push("Första");
stack.Push("Andra");
string last = stack.Pop();   // "Andra"
```

## Egna Generics

```csharp
// Generisk klass
public class Box<T>
{
    private T content;
    
    public void Store(T item)
    {
        content = item;
    }
    
    public T Retrieve()
    {
        return content;
    }
}

// Användning
Box<int> intBox = new Box<int>();
intBox.Store(42);
int number = intBox.Retrieve();

Box<string> stringBox = new Box<string>();
stringBox.Store("Hello");
string text = stringBox.Retrieve();
```

!!! success "Best Practice"
    Använd List<T> för de flesta fall. Dictionary<TKey, TValue> för lookups. Queue/Stack för specifika ordningsbehov.

## Nästa lektion

Lär dig om [Enums](13-enums.md).
