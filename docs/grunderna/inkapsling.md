# 6. Inkapsling (Encapsulation)

Inkapsling handlar om att dölja intern implementation och bara exponera det som är nödvändigt. Detta skyddar data från felaktig användning.

## Åtkomstnivåer

- **public** - Tillgänglig överallt
- **private** - Bara tillgänglig inom klassen
- **protected** - Tillgänglig inom klassen och i subklasser
- **internal** - Tillgänglig inom samma projekt

## Exempel på inkapsling

```csharp
public class BankAccount
{
    private decimal balance; // Privat - kan inte ändras direkt
    
    // Public property med validering
    public decimal Balance
    {
        get { return balance; }
    }
    
    // Public metoder för att ändra balance
    public void Deposit(decimal amount)
    {
        if (amount > 0)
        {
            balance += amount;
            Console.WriteLine($"Satte in {amount} kr");
        }
        else
        {
            Console.WriteLine("Beloppet måste vara positivt");
        }
    }
    
    public bool Withdraw(decimal amount)
    {
        if (amount > 0 && amount <= balance)
        {
            balance -= amount;
            Console.WriteLine($"Tog ut {amount} kr");
            return true;
        }
        else
        {
            Console.WriteLine("Ogiltigt belopp eller otillräckligt saldo");
            return false;
        }
    }
}

// Användning
BankAccount account = new BankAccount();
account.Deposit(1000);
account.Withdraw(500);
Console.WriteLine($"Saldo: {account.Balance}"); // Output: Saldo: 500

// Detta fungerar INTE (balance är private):
// account.balance = 1000000; // FEL!
```

## Varför inkapsling?

### Fördelar:

- **Kontroll**: Vi kan validera data innan den ändras
- **Flexibilitet**: Vi kan ändra intern implementation utan att påverka andra delar
- **Säkerhet**: Känslig data kan skyddas

!!! success "Best Practice"
    Gör fält private och exponera dem endast genom properties och metoder med validering.

## Nästa lektion

Lär dig om [Arv (Inheritance)](arv.md).
