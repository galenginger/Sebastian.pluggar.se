# 24. Design Patterns

Design patterns är beprövade lösningar på vanliga programmeringsutmaningar.

## Creational Patterns

### Singleton Pattern

Garanterar att endast en instans av en klass finns.

```csharp
public sealed class DatabaseConnection
{
    private static DatabaseConnection? instance;
    private static readonly object lockObject = new object();
    
    private DatabaseConnection()
    {
        Console.WriteLine("Database connection skapad");
    }
    
    public static DatabaseConnection Instance
    {
        get
        {
            if (instance == null)
            {
                lock (lockObject)
                {
                    if (instance == null)
                    {
                        instance = new DatabaseConnection();
                    }
                }
            }
            return instance;
        }
    }
    
    public void Query(string sql)
    {
        Console.WriteLine($"Executing: {sql}");
    }
}

// Användning
var db1 = DatabaseConnection.Instance;
var db2 = DatabaseConnection.Instance;
// db1 och db2 är samma instans!
```

### Factory Pattern

Skapar objekt utan att specificera den exakta klassen.

```csharp
public interface IVehicle
{
    void Drive();
}

public class Car : IVehicle
{
    public void Drive() => Console.WriteLine("Kör bil");
}

public class Motorcycle : IVehicle
{
    public void Drive() => Console.WriteLine("Kör motorcykel");
}

public class VehicleFactory
{
    public static IVehicle CreateVehicle(string type) => type.ToLower() switch
    {
        "car" => new Car(),
        "motorcycle" => new Motorcycle(),
        _ => throw new ArgumentException("Okänd fordonstyp")
    };
}

// Användning
var vehicle = VehicleFactory.CreateVehicle("car");
vehicle.Drive();
```

### Builder Pattern

Skapar komplexa objekt steg för steg.

```csharp
public record Pizza
{
    public required string Size { get; init; }
    public required string Dough { get; init; }
    public List<string> Toppings { get; init; } = new();
    public bool ExtraCheese { get; init; }
}

public class PizzaBuilder
{
    private string size = "Medium";
    private string dough = "Thin";
    private List<string> toppings = new();
    private bool extraCheese = false;
    
    public PizzaBuilder WithSize(string size)
    {
        this.size = size;
        return this;
    }
    
    public PizzaBuilder WithDough(string dough)
    {
        this.dough = dough;
        return this;
    }
    
    public PizzaBuilder AddTopping(string topping)
    {
        toppings.Add(topping);
        return this;
    }
    
    public PizzaBuilder WithExtraCheese()
    {
        extraCheese = true;
        return this;
    }
    
    public Pizza Build() => new Pizza
    {
        Size = size,
        Dough = dough,
        Toppings = toppings,
        ExtraCheese = extraCheese
    };
}

// Användning
var pizza = new PizzaBuilder()
    .WithSize("Large")
    .WithDough("Stuffed")
    .AddTopping("Pepperoni")
    .AddTopping("Mushrooms")
    .WithExtraCheese()
    .Build();
```

## Structural Patterns

### Adapter Pattern

Gör att inkompatibla interface kan arbeta tillsammans.

```csharp
// Gammalt system
public class OldPaymentProcessor
{
    public void ProcessOldPayment(string accountNumber, decimal amount)
    {
        Console.WriteLine($"Processing {amount} from account {accountNumber}");
    }
}

// Nytt interface
public interface IModernPaymentProcessor
{
    void ProcessPayment(PaymentInfo info);
}

public record PaymentInfo(string Account, decimal Amount);

// Adapter
public class PaymentAdapter : IModernPaymentProcessor
{
    private readonly OldPaymentProcessor oldProcessor = new();
    
    public void ProcessPayment(PaymentInfo info)
    {
        oldProcessor.ProcessOldPayment(info.Account, info.Amount);
    }
}

// Användning
IModernPaymentProcessor processor = new PaymentAdapter();
processor.ProcessPayment(new PaymentInfo("123456", 500m));
```

### Decorator Pattern

Lägger till funktionalitet till objekt dynamiskt.

```csharp
public interface ICoffee
{
    string GetDescription();
    decimal GetCost();
}

public class SimpleCoffee : ICoffee
{
    public string GetDescription() => "Kaffe";
    public decimal GetCost() => 30m;
}

// Decorators
public abstract class CoffeeDecorator : ICoffee
{
    protected ICoffee coffee;
    
    public CoffeeDecorator(ICoffee coffee)
    {
        this.coffee = coffee;
    }
    
    public virtual string GetDescription() => coffee.GetDescription();
    public virtual decimal GetCost() => coffee.GetCost();
}

public class MilkDecorator : CoffeeDecorator
{
    public MilkDecorator(ICoffee coffee) : base(coffee) { }
    
    public override string GetDescription() => coffee.GetDescription() + ", Mjölk";
    public override decimal GetCost() => coffee.GetCost() + 5m;
}

public class SugarDecorator : CoffeeDecorator
{
    public SugarDecorator(ICoffee coffee) : base(coffee) { }
    
    public override string GetDescription() => coffee.GetDescription() + ", Socker";
    public override decimal GetCost() => coffee.GetCost() + 2m;
}

// Användning
ICoffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
Console.WriteLine($"{coffee.GetDescription()}: {coffee.GetCost()} kr");
```

## Behavioral Patterns

### Observer Pattern

Notifierar flera objekt om förändringar.

```csharp
public interface IObserver
{
    void Update(string message);
}

public interface ISubject
{
    void Attach(IObserver observer);
    void Detach(IObserver observer);
    void Notify(string message);
}

public class NewsAgency : ISubject
{
    private List<IObserver> observers = new();
    
    public void Attach(IObserver observer)
    {
        observers.Add(observer);
    }
    
    public void Detach(IObserver observer)
    {
        observers.Remove(observer);
    }
    
    public void Notify(string message)
    {
        foreach (var observer in observers)
        {
            observer.Update(message);
        }
    }
    
    public void PublishNews(string news)
    {
        Console.WriteLine($"Publicerar: {news}");
        Notify(news);
    }
}

public class NewsSubscriber : IObserver
{
    private string name;
    
    public NewsSubscriber(string name)
    {
        this.name = name;
    }
    
    public void Update(string message)
    {
        Console.WriteLine($"{name} fick nyheten: {message}");
    }
}

// Användning
var agency = new NewsAgency();
var subscriber1 = new NewsSubscriber("Anna");
var subscriber2 = new NewsSubscriber("Erik");

agency.Attach(subscriber1);
agency.Attach(subscriber2);
agency.PublishNews("Viktigt meddelande!");
```

### Strategy Pattern

Definierar en familj av algoritmer och gör dem utbytbara.

```csharp
public interface IShippingStrategy
{
    decimal Calculate(decimal orderTotal);
}

public class StandardShipping : IShippingStrategy
{
    public decimal Calculate(decimal orderTotal)
    {
        return orderTotal < 500 ? 59m : 0m;
    }
}

public class ExpressShipping : IShippingStrategy
{
    public decimal Calculate(decimal orderTotal)
    {
        return 149m;
    }
}

public class InternationalShipping : IShippingStrategy
{
    public decimal Calculate(decimal orderTotal)
    {
        return orderTotal * 0.1m;
    }
}

public class Order
{
    public decimal Total { get; set; }
    private IShippingStrategy shippingStrategy;
    
    public Order(IShippingStrategy strategy)
    {
        shippingStrategy = strategy;
    }
    
    public void SetShippingStrategy(IShippingStrategy strategy)
    {
        shippingStrategy = strategy;
    }
    
    public decimal CalculateShipping()
    {
        return shippingStrategy.Calculate(Total);
    }
}

// Användning
var order = new Order(new StandardShipping()) { Total = 300m };
Console.WriteLine($"Standard: {order.CalculateShipping()} kr");

order.SetShippingStrategy(new ExpressShipping());
Console.WriteLine($"Express: {order.CalculateShipping()} kr");
```

### Command Pattern

Kapslar in en förfrågan som ett objekt.

```csharp
public interface ICommand
{
    void Execute();
    void Undo();
}

public class Light
{
    public void TurnOn() => Console.WriteLine("Ljuset är på");
    public void TurnOff() => Console.WriteLine("Ljuset är av");
}

public class TurnOnCommand : ICommand
{
    private Light light;
    
    public TurnOnCommand(Light light)
    {
        this.light = light;
    }
    
    public void Execute() => light.TurnOn();
    public void Undo() => light.TurnOff();
}

public class RemoteControl
{
    private Stack<ICommand> commandHistory = new();
    
    public void PressButton(ICommand command)
    {
        command.Execute();
        commandHistory.Push(command);
    }
    
    public void PressUndo()
    {
        if (commandHistory.Count > 0)
        {
            var command = commandHistory.Pop();
            command.Undo();
        }
    }
}

// Användning
var light = new Light();
var remote = new RemoteControl();
var turnOn = new TurnOnCommand(light);

remote.PressButton(turnOn);
remote.PressUndo();
```

!!! tip "När använda Design Patterns?"
    - **Singleton**: Loggning, konfiguration, databas-connections
    - **Factory**: När du inte vet exakt vilken klass som ska skapas
    - **Observer**: Event-system, notifikationer
    - **Strategy**: När du har olika varianter av samma algoritm
    - **Decorator**: För att lägga till funktionalitet dynamiskt

## Nästa lektion

Lär dig om [Testing och Unit Tests](25-testing.md).
