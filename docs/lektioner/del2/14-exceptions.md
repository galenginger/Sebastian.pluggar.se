# 14. Exception Handling

Exceptions hanterar fel som uppstår under körning av programmet.

## Try-Catch-Finally

```csharp
public class FileProcessor
{
    public string ReadFile(string filePath)
    {
        try
        {
            string content = File.ReadAllText(filePath);
            return content;
        }
        catch (FileNotFoundException ex)
        {
            Console.WriteLine($"Filen hittades inte: {ex.Message}");
            return string.Empty;
        }
        catch (UnauthorizedAccessException ex)
        {
            Console.WriteLine($"Ingen åtkomst: {ex.Message}");
            return string.Empty;
        }
        catch (Exception ex) // Catch all
        {
            Console.WriteLine($"Ett fel uppstod: {ex.Message}");
            throw; // Re-throw
        }
        finally
        {
            // Körs alltid, oavsett om exception eller inte
            Console.WriteLine("Stänger resurser...");
        }
    }
}
```

## Kasta Egna Exceptions

```csharp
public class BankAccount
{
    private decimal balance;
    
    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException(
                "Beloppet måste vara positivt", 
                nameof(amount)
            );
        }
        
        if (amount > balance)
        {
            throw new InvalidOperationException(
                $"Otillräckligt saldo. Saldo: {balance}, Försöker ta ut: {amount}"
            );
        }
        
        balance -= amount;
    }
}

// Användning
BankAccount account = new BankAccount();
try
{
    account.Withdraw(-100); // Kastar ArgumentException
}
catch (ArgumentException ex)
{
    Console.WriteLine($"Felaktigt argument: {ex.Message}");
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"Ogiltig operation: {ex.Message}");
}
```

## Custom Exceptions

```csharp
public class InsufficientFundsException : Exception
{
    public decimal RequestedAmount { get; }
    public decimal AvailableBalance { get; }
    
    public InsufficientFundsException(decimal requested, decimal available)
        : base($"Otillräckligt saldo. Begärt: {requested}, Tillgängligt: {available}")
    {
        RequestedAmount = requested;
        AvailableBalance = available;
    }
}

public class BankAccount
{
    private decimal balance = 1000;
    
    public void Withdraw(decimal amount)
    {
        if (amount > balance)
        {
            throw new InsufficientFundsException(amount, balance);
        }
        balance -= amount;
    }
}

// Användning
BankAccount account = new BankAccount();
try
{
    account.Withdraw(1500);
}
catch (InsufficientFundsException ex)
{
    Console.WriteLine(ex.Message);
    Console.WriteLine($"Du saknar {ex.RequestedAmount - ex.AvailableBalance} kr");
}
```

## Exception Filters (C# 6+)

```csharp
public void ProcessData(string data)
{
    try
    {
        // Process data
    }
    catch (Exception ex) when (ex.Message.Contains("network"))
    {
        Console.WriteLine("Nätverksfel");
    }
    catch (Exception ex) when (ex is IOException || ex is TimeoutException)
    {
        Console.WriteLine("I/O eller timeout fel");
    }
}
```

## Using Statement för Resources

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
```

!!! warning "Best Practices"
    - Fånga specifika exceptions först, generella sist
    - Använd finally för cleanup
    - Kasta inte bara `Exception`, använd specifika typer
    - Logga exceptions ordentligt
    - Använd using för IDisposable objekt

## Nästa lektion

Lär dig om [Delegates och Events](15-delegates.md).
