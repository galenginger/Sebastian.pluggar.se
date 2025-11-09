# 16. Namespace och Using

Namespaces organiserar kod och undviker namnkonflikter mellan klasser.

## Grundläggande Namespace

```csharp
// Company.Project.Domain.cs
namespace Company.Project.Domain
{
    public class Customer
    {
        public string Name { get; set; }
    }
}

// Company.Project.Services.cs
namespace Company.Project.Services
{
    public class CustomerService
    {
        public void AddCustomer(Domain.Customer customer)
        {
            // Logic
        }
    }
}
```

## Using Directives

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Company.Project.Domain;
using Company.Project.Services;

// Alias
using CustomerList = System.Collections.Generic.List<Company.Project.Domain.Customer>;

public class Program
{
    public void Main()
    {
        // Kan nu använda utan full namespace
        Customer customer = new Customer();
        CustomerService service = new CustomerService();
        CustomerList customers = new CustomerList();
    }
}
```

## File-scoped Namespace (C# 10+)

```csharp
// Gammalt sätt
namespace Company.Project
{
    public class OldWay
    {
        // Indenterad kod
    }
}

// Nytt sätt - sparar indentering!
namespace Company.Project;

public class NewWay
{
    // Ingen extra indentering!
}
```

## Global Using (C# 10+)

```csharp
// GlobalUsings.cs
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using Company.Project.Domain;

// Nu behöver alla andra filer inte using statements för dessa!

// Program.cs
namespace Company.Project;

public class Program
{
    public void Main()
    {
        // Kan använda Customer direkt
        Customer customer = new Customer();
        List<string> names = new List<string>(); // List finns globalt
    }
}
```

## Using Statement för Resource Management

```csharp
// Gammalt sätt
public void OldWay()
{
    using (StreamReader reader = new StreamReader("file.txt"))
    {
        string content = reader.ReadToEnd();
    } // Disposed här
}

// Nytt sätt (C# 8+)
public void NewWay()
{
    using StreamReader reader = new StreamReader("file.txt");
    string content = reader.ReadToEnd();
    // Disposed automatiskt i slutet av metoden
}

// Med using declaration
public void ProcessFiles()
{
    using var file1 = new StreamReader("file1.txt");
    using var file2 = new StreamReader("file2.txt");
    
    // Båda filerna disposed när metoden avslutas
}
```

## Namespace Alias

```csharp
using Project1 = Company.Project1;
using Project2 = Company.Project2;

namespace Company.Project
{
    public class Program
    {
        public void Main()
        {
            // Tydligt vilken Customer vi använder
            Project1.Customer customer1 = new Project1.Customer();
            Project2.Customer customer2 = new Project2.Customer();
        }
    }
}
```

## Nested Namespaces

```csharp
namespace Company.Project
{
    namespace Models
    {
        public class Customer { }
    }
    
    namespace Services
    {
        public class CustomerService { }
    }
}

// Eller kortare:
namespace Company.Project.Models
{
    public class Customer { }
}

namespace Company.Project.Services
{
    public class CustomerService { }
}
```

## Implicit Usings (.NET 6+)

```csharp
// I .csproj
<PropertyGroup>
    <ImplicitUsings>enable</ImplicitUsings>
</PropertyGroup>

// Då inkluderas automatiskt:
// - System
// - System.Collections.Generic
// - System.IO
// - System.Linq
// - System.Net.Http
// - System.Threading
// - System.Threading.Tasks
```

!!! tip "Best Practices"
    - Använd file-scoped namespaces i C# 10+
    - Sätt global usings i en separat fil
    - Organisera kod i logiska namespaces
    - Undvik för djupt nästlade namespaces

## Nästa lektion

Gå vidare till [Del 3: Moderna C# Features](../del3/17-modern-features.md).
