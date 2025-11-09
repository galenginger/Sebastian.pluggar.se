# 15. Delegates och Events

Delegates är referenser till metoder. Events använder delegates för att meddela lyssnare om att något har hänt.

## Delegates

```csharp
// Deklarera delegate type
public delegate void MessageHandler(string message);

public class Notifier
{
    // Delegate field
    public MessageHandler OnMessage;
    
    public void SendMessage(string message)
    {
        // Anropa alla registrerade metoder
        OnMessage?.Invoke(message);
    }
}

// Användning
Notifier notifier = new Notifier();

// Registrera metoder
notifier.OnMessage += (msg) => Console.WriteLine($"Email: {msg}");
notifier.OnMessage += (msg) => Console.WriteLine($"SMS: {msg}");

notifier.SendMessage("Hej!"); 
// Output:
// Email: Hej!
// SMS: Hej!
```

## Built-in Delegates

```csharp
// Action - ingen return
Action<string> printMessage = (msg) => Console.WriteLine(msg);
printMessage("Hello");

// Func - har return
Func<int, int, int> add = (a, b) => a + b;
int result = add(5, 3); // 8

// Predicate - returnerar bool
Predicate<int> isEven = (n) => n % 2 == 0;
bool even = isEven(4); // true

// Användning med List
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6 };
List<int> evenNumbers = numbers.FindAll(isEven);
```

## Events

```csharp
// EventArgs för att skicka data med event
public class OrderEventArgs : EventArgs
{
    public int OrderId { get; set; }
    public decimal Total { get; set; }
}

public class OrderProcessor
{
    // Event declaration
    public event EventHandler<OrderEventArgs> OrderPlaced;
    public event EventHandler<OrderEventArgs> OrderShipped;
    
    public void PlaceOrder(int orderId, decimal total)
    {
        Console.WriteLine($"Behandlar order {orderId}...");
        
        // Raise event
        OrderPlaced?.Invoke(this, new OrderEventArgs 
        { 
            OrderId = orderId, 
            Total = total 
        });
    }
    
    public void ShipOrder(int orderId, decimal total)
    {
        Console.WriteLine($"Skickar order {orderId}...");
        OrderShipped?.Invoke(this, new OrderEventArgs 
        { 
            OrderId = orderId, 
            Total = total 
        });
    }
}

// Användning
OrderProcessor processor = new OrderProcessor();

// Subscribe till events
processor.OrderPlaced += (sender, e) =>
{
    Console.WriteLine($"Order {e.OrderId} placerad! Total: {e.Total} kr");
};

processor.OrderPlaced += (sender, e) =>
{
    Console.WriteLine("Skickar bekräftelse-email...");
};

processor.OrderShipped += (sender, e) =>
{
    Console.WriteLine($"Order {e.OrderId} skickad!");
};

// Trigger events
processor.PlaceOrder(101, 599);
processor.ShipOrder(101, 599);
```

## Observer Pattern med Events

```csharp
public class TemperatureSensor
{
    private double temperature;
    
    public event EventHandler<double> TemperatureChanged;
    
    public double Temperature
    {
        get => temperature;
        set
        {
            if (temperature != value)
            {
                temperature = value;
                OnTemperatureChanged(temperature);
            }
        }
    }
    
    protected virtual void OnTemperatureChanged(double newTemp)
    {
        TemperatureChanged?.Invoke(this, newTemp);
    }
}

// Användning
TemperatureSensor sensor = new TemperatureSensor();

sensor.TemperatureChanged += (sender, temp) =>
{
    if (temp > 30)
        Console.WriteLine($"VARNING: Hög temperatur! {temp}°C");
};

sensor.TemperatureChanged += (sender, temp) =>
{
    Console.WriteLine($"Logger: Temperatur ändrad till {temp}°C");
};

sensor.Temperature = 25; // Triggar events
sensor.Temperature = 35; // Triggar events igen
```

## Multicast Delegates

```csharp
public delegate void MathOperation(int x, int y);

public class Calculator
{
    public void Add(int x, int y) => Console.WriteLine($"{x} + {y} = {x + y}");
    public void Subtract(int x, int y) => Console.WriteLine($"{x} - {y} = {x - y}");
    public void Multiply(int x, int y) => Console.WriteLine($"{x} * {y} = {x * y}");
}

// Kombinera flera metoder
Calculator calc = new Calculator();
MathOperation operations = calc.Add;
operations += calc.Subtract;
operations += calc.Multiply;

// Anropar alla metoder
operations(10, 5);
// Output:
// 10 + 5 = 15
// 10 - 5 = 5
// 10 * 5 = 50
```

!!! tip "Events vs Delegates"
    - **Delegates** = metod-pekare, kan anropas av vem som helst
    - **Events** = säkrare, kan bara triggas av klassen som äger dem
    - Använd events för notification patterns

## Nästa lektion

Lär dig om [Namespace och Using](namespace.md).
