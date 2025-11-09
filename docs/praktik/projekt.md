# 28. Projekt och exempel

Här hittar du kompletta projekt som kombinerar allt du lärt dig!

## Projekt 1: Bibliotekssystem

Ett komplett bibliotekssystem med SOLID-principer och moderna C# features.

```csharp
// Domain Models
public record Book(
    string ISBN,
    string Title,
    string Author,
    int PublicationYear
);

public record Member(
    int Id,
    string Name,
    Email Email,
    DateTime MemberSince
);

public record Email
{
    public string Value { get; }
    
    public Email(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            throw new ArgumentException("Ogiltig email");
        Value = email;
    }
}

public record Loan(
    int Id,
    string ISBN,
    int MemberId,
    DateTime LoanDate,
    DateTime? ReturnDate = null
)
{
    public bool IsReturned => ReturnDate.HasValue;
    public TimeSpan LoanDuration => (ReturnDate ?? DateTime.Now) - LoanDate;
}

// Interfaces
public interface IBookRepository
{
    Book? GetByISBN(string isbn);
    IEnumerable<Book> GetAll();
    void Add(Book book);
    void Remove(string isbn);
}

public interface IMemberRepository
{
    Member? GetById(int id);
    IEnumerable<Member> GetAll();
    void Add(Member member);
}

public interface ILoanRepository
{
    IEnumerable<Loan> GetActiveLoans();
    IEnumerable<Loan> GetLoansByMember(int memberId);
    void Add(Loan loan);
    void Update(Loan loan);
}

// Services
public class LibraryService
{
    private readonly IBookRepository bookRepo;
    private readonly IMemberRepository memberRepo;
    private readonly ILoanRepository loanRepo;
    
    public LibraryService(
        IBookRepository bookRepo,
        IMemberRepository memberRepo,
        ILoanRepository loanRepo)
    {
        this.bookRepo = bookRepo;
        this.memberRepo = memberRepo;
        this.loanRepo = loanRepo;
    }
    
    public void LoanBook(string isbn, int memberId)
    {
        var book = bookRepo.GetByISBN(isbn) 
            ?? throw new InvalidOperationException("Boken finns inte");
        
        var member = memberRepo.GetById(memberId) 
            ?? throw new InvalidOperationException("Medlem finns inte");
        
        var activeLoans = loanRepo.GetActiveLoans()
            .Where(l => l.ISBN == isbn);
        
        if (activeLoans.Any())
            throw new InvalidOperationException("Boken är redan utlånad");
        
        var loan = new Loan(
            Id: GenerateId(),
            ISBN: isbn,
            MemberId: memberId,
            LoanDate: DateTime.Now
        );
        
        loanRepo.Add(loan);
    }
    
    public void ReturnBook(int loanId)
    {
        var loans = loanRepo.GetActiveLoans();
        var loan = loans.FirstOrDefault(l => l.Id == loanId)
            ?? throw new InvalidOperationException("Lånet finns inte");
        
        var updatedLoan = loan with { ReturnDate = DateTime.Now };
        loanRepo.Update(updatedLoan);
    }
    
    public IEnumerable<Book> SearchBooks(string query)
    {
        return bookRepo.GetAll()
            .Where(b => 
                b.Title.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                b.Author.Contains(query, StringComparison.OrdinalIgnoreCase));
    }
    
    private int GenerateId() => Random.Shared.Next(1000, 9999);
}

// In-Memory Implementation (för demo)
public class InMemoryBookRepository : IBookRepository
{
    private List<Book> books = new();
    
    public Book? GetByISBN(string isbn) => books.FirstOrDefault(b => b.ISBN == isbn);
    public IEnumerable<Book> GetAll() => books;
    public void Add(Book book) => books.Add(book);
    public void Remove(string isbn) => books.RemoveAll(b => b.ISBN == isbn);
}

// Usage
var bookRepo = new InMemoryBookRepository();
var memberRepo = new InMemoryMemberRepository();
var loanRepo = new InMemoryLoanRepository();

var library = new LibraryService(bookRepo, memberRepo, loanRepo);

// Lägg till böcker
bookRepo.Add(new Book("978-1234", "C# in Depth", "Jon Skeet", 2019));
bookRepo.Add(new Book("978-5678", "Clean Code", "Robert Martin", 2008));

// Lägg till medlem
memberRepo.Add(new Member(1, "Anna Andersson", new Email("anna@email.com"), DateTime.Now));

// Låna bok
library.LoanBook("978-1234", 1);

// Returnera bok
// library.ReturnBook(loanId);
```

## Projekt 2: E-handelssystem

```csharp
// Domain Models
public record Product(int Id, string Name, decimal Price, int Stock);

public record CartItem(int ProductId, string ProductName, int Quantity, decimal UnitPrice)
{
    public decimal Total => Quantity * UnitPrice;
}

public enum OrderStatus
{
    Pending,
    Confirmed,
    Shipped,
    Delivered,
    Cancelled
}

public class ShoppingCart
{
    private List<CartItem> items = new();
    
    public IReadOnlyList<CartItem> Items => items.AsReadOnly();
    public decimal Total => items.Sum(i => i.Total);
    
    public void AddItem(Product product, int quantity)
    {
        ArgumentNullException.ThrowIfNull(product);
        
        if (quantity <= 0)
            throw new ArgumentException("Antal måste vara positivt");
        
        if (quantity > product.Stock)
            throw new InvalidOperationException("Inte tillräckligt i lager");
        
        var existing = items.FirstOrDefault(i => i.ProductId == product.Id);
        if (existing != null)
        {
            items.Remove(existing);
            items.Add(existing with { Quantity = existing.Quantity + quantity });
        }
        else
        {
            items.Add(new CartItem(product.Id, product.Name, quantity, product.Price));
        }
    }
    
    public void RemoveItem(int productId)
    {
        items.RemoveAll(i => i.ProductId == productId);
    }
    
    public void Clear() => items.Clear();
}

// Services
public interface IPaymentService
{
    bool ProcessPayment(decimal amount, string cardNumber);
}

public interface IInventoryService
{
    bool ReserveStock(int productId, int quantity);
    void ReleaseStock(int productId, int quantity);
}

public interface INotificationService
{
    void SendOrderConfirmation(string email, int orderId);
}

public class OrderService
{
    private readonly IPaymentService paymentService;
    private readonly IInventoryService inventoryService;
    private readonly INotificationService notificationService;
    
    public OrderService(
        IPaymentService paymentService,
        IInventoryService inventoryService,
        INotificationService notificationService)
    {
        this.paymentService = paymentService;
        this.inventoryService = inventoryService;
        this.notificationService = notificationService;
    }
    
    public int PlaceOrder(ShoppingCart cart, string customerEmail, string cardNumber)
    {
        // Validera
        if (cart.Items.Count == 0)
            throw new InvalidOperationException("Vagnen är tom");
        
        // Reservera lager
        foreach (var item in cart.Items)
        {
            if (!inventoryService.ReserveStock(item.ProductId, item.Quantity))
            {
                // Rollback tidigare reservationer
                ReleaseAllReservations(cart);
                throw new InvalidOperationException($"{item.ProductName} är slut i lager");
            }
        }
        
        // Processera betalning
        if (!paymentService.ProcessPayment(cart.Total, cardNumber))
        {
            ReleaseAllReservations(cart);
            throw new InvalidOperationException("Betalningen misslyckades");
        }
        
        // Skapa order
        int orderId = CreateOrder(cart, customerEmail);
        
        // Skicka bekräftelse
        notificationService.SendOrderConfirmation(customerEmail, orderId);
        
        return orderId;
    }
    
    private void ReleaseAllReservations(ShoppingCart cart)
    {
        foreach (var item in cart.Items)
        {
            inventoryService.ReleaseStock(item.ProductId, item.Quantity);
        }
    }
    
    private int CreateOrder(ShoppingCart cart, string email)
    {
        // Spara order i databas
        return Random.Shared.Next(1000, 9999);
    }
}

// Usage
var cart = new ShoppingCart();
var product1 = new Product(1, "C# bok", 299m, 10);
var product2 = new Product(2, "Tangentbord", 499m, 5);

cart.AddItem(product1, 2);
cart.AddItem(product2, 1);

Console.WriteLine($"Total: {cart.Total} kr");

var orderService = new OrderService(
    new FakePaymentService(),
    new FakeInventoryService(),
    new FakeNotificationService()
);

int orderId = orderService.PlaceOrder(cart, "customer@email.com", "1234-5678");
Console.WriteLine($"Order {orderId} skapad!");
```

## Projekt 3: Todo-app med CRUD

```csharp
public record TodoItem(
    int Id,
    string Title,
    string? Description,
    DateTime CreatedAt,
    DateTime? DueDate = null,
    bool IsCompleted = false
);

public interface ITodoRepository
{
    IEnumerable<TodoItem> GetAll();
    TodoItem? GetById(int id);
    void Add(TodoItem item);
    void Update(TodoItem item);
    void Delete(int id);
}

public class TodoService
{
    private readonly ITodoRepository repository;
    
    public TodoService(ITodoRepository repository)
    {
        this.repository = repository;
    }
    
    public TodoItem CreateTodo(string title, string? description = null, DateTime? dueDate = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Titel kan inte vara tom");
        
        var todo = new TodoItem(
            Id: GenerateId(),
            Title: title,
            Description: description,
            CreatedAt: DateTime.Now,
            DueDate: dueDate
        );
        
        repository.Add(todo);
        return todo;
    }
    
    public void CompleteTodo(int id)
    {
        var todo = repository.GetById(id) 
            ?? throw new InvalidOperationException("Todo finns inte");
        
        var completed = todo with { IsCompleted = true };
        repository.Update(completed);
    }
    
    public void UpdateTodo(int id, string? newTitle = null, string? newDescription = null, DateTime? newDueDate = null)
    {
        var todo = repository.GetById(id) 
            ?? throw new InvalidOperationException("Todo finns inte");
        
        var updated = todo with
        {
            Title = newTitle ?? todo.Title,
            Description = newDescription ?? todo.Description,
            DueDate = newDueDate ?? todo.DueDate
        };
        
        repository.Update(updated);
    }
    
    public void DeleteTodo(int id)
    {
        repository.Delete(id);
    }
    
    public IEnumerable<TodoItem> GetOverdueTodos()
    {
        return repository.GetAll()
            .Where(t => !t.IsCompleted && t.DueDate < DateTime.Now);
    }
    
    public IEnumerable<TodoItem> GetTodaysTodos()
    {
        var today = DateTime.Today;
        return repository.GetAll()
            .Where(t => !t.IsCompleted && t.DueDate?.Date == today);
    }
    
    private int GenerateId() => Random.Shared.Next(1, 10000);
}

// In-Memory Repository
public class InMemoryTodoRepository : ITodoRepository
{
    private List<TodoItem> todos = new();
    
    public IEnumerable<TodoItem> GetAll() => todos;
    public TodoItem? GetById(int id) => todos.FirstOrDefault(t => t.Id == id);
    public void Add(TodoItem item) => todos.Add(item);
    public void Update(TodoItem item)
    {
        var index = todos.FindIndex(t => t.Id == item.Id);
        if (index >= 0)
            todos[index] = item;
    }
    public void Delete(int id) => todos.RemoveAll(t => t.Id == id);
}

// Usage
var repo = new InMemoryTodoRepository();
var todoService = new TodoService(repo);

// Skapa todos
var todo1 = todoService.CreateTodo("Köp mjölk", dueDate: DateTime.Today);
var todo2 = todoService.CreateTodo("Läs C# bok", "Kapitel 5-10", DateTime.Today.AddDays(7));

// Markera som klar
todoService.CompleteTodo(todo1.Id);

// Visa dagens todos
var todaysTodos = todoService.GetTodaysTodos();
foreach (var todo in todaysTodos)
{
    Console.WriteLine($"[ ] {todo.Title}");
}
```

## Best Practices för Projekt

!!! tip "Projektstruktur"
    ```
    MyProject/
    ├── Domain/          # Models, entities
    ├── Services/        # Business logic
    ├── Repositories/    # Data access
    ├── Interfaces/      # Contracts
    └── Tests/          # Unit tests
    ```

!!! success "SOLID Checklist"
    - [x] Single Responsibility - Varje klass har EN uppgift
    - [x] Open/Closed - Utökningsbar utan att ändra befintlig kod
    - [x] Liskov Substitution - Subtypes kan ersätta base types
    - [x] Interface Segregation - Små, specifika interfaces
    - [x] Dependency Inversion - Beroenden via interfaces

!!! warning "Undvik"
    - God Objects (allt i en klass)
    - Primitive Obsession (använd value objects)
    - Tight Coupling (använd DI)
    - Anemic Models (logik i domain objects)

## Grattis! 🎉

Du har nu gått igenom hela OOP-kursen! Du har lärt dig:

- ✅ **Del 1**: Grundläggande OOP (klasser, properties, metoder, arv, polymorfism)
- ✅ **Del 2**: Viktiga koncept (static, collections, enums, exceptions, delegates)
- ✅ **Del 3**: Moderna C# features (C# 9-12, records, pattern matching, nullable)
- ✅ **Del 4**: Praktik (SOLID, design patterns, testing, UML, misstag, projekt)

### Nästa steg

1. Bygg egna projekt med dessa tekniker
2. Läs Clean Code av Robert Martin
3. Utforska mer avancerade patterns
4. Bidra till open source projekt

**Lycka till med din programmeringsresa!** 🚀
