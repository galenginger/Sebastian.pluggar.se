# 13. Enums

Enums (enumerations) definierar en uppsättning namngivna konstanter som representerar relaterade värden.

## Grundläggande Enum

```csharp
public enum DayOfWeek
{
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

// Användning
DayOfWeek today = DayOfWeek.Monday;

if (today == DayOfWeek.Saturday || today == DayOfWeek.Sunday)
{
    Console.WriteLine("Helg!");
}

// String till enum
DayOfWeek parsed = Enum.Parse<DayOfWeek>("Friday");

// Enum till string
string dayName = today.ToString(); // "Monday"
```

## Enum med Värden

```csharp
public enum ErrorLevel
{
    None = 0,
    Warning = 1,
    Error = 2,
    Critical = 3
}

public enum HttpStatusCode
{
    OK = 200,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    InternalServerError = 500
}

// Användning
HttpStatusCode status = HttpStatusCode.NotFound;
int statusCode = (int)status; // 404

if (statusCode >= 400)
{
    Console.WriteLine("Ett fel uppstod!");
}
```

## Flags Enum (Bitwise)

```csharp
[Flags]
public enum Permissions
{
    None = 0,
    Read = 1,
    Write = 2,
    Delete = 4,
    Execute = 8
}

// Kombinera flera värden
Permissions userPermissions = Permissions.Read | Permissions.Write;

// Kolla om har permission
bool canRead = (userPermissions & Permissions.Read) == Permissions.Read;
bool canDelete = (userPermissions & Permissions.Delete) == Permissions.Delete;

// Lägg till permission
userPermissions |= Permissions.Execute;

// Ta bort permission
userPermissions &= ~Permissions.Write;
```

## Praktiskt Exempel

```csharp
public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

public class Order
{
    public int OrderId { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime OrderDate { get; set; }
    
    public void UpdateStatus(OrderStatus newStatus)
    {
        if (Status == OrderStatus.Cancelled)
        {
            throw new InvalidOperationException("Kan inte uppdatera avbeställd order");
        }
        
        Status = newStatus;
        
        switch (Status)
        {
            case OrderStatus.Shipped:
                Console.WriteLine("Skickar spårningsinformation...");
                break;
            case OrderStatus.Delivered:
                Console.WriteLine("Skickar kvitto...");
                break;
        }
    }
}

// Användning
Order order = new Order { OrderId = 101, Status = OrderStatus.Pending };
order.UpdateStatus(OrderStatus.Processing);
order.UpdateStatus(OrderStatus.Shipped);
```

!!! tip "När använda enums?"
    Använd enums när du har en begränsad uppsättning relaterade värden som:
    - Dagar i veckan
    - Status-värden
    - Prioritetsnivåer
    - Typer/kategorier

## Nästa lektion

Lär dig om [Exception Handling](14-exceptions.md).
