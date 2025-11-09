# 5. Konstruktorer

En konstruktor är en speciell metod som körs när ett objekt skapas. Den används för att initiera objektet.

## Grundläggande konstruktor

```csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    // Konstruktor
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }
}

// Användning
Person person = new Person("Anna", 25);
Console.WriteLine(person.Name); // Output: Anna
```

## Flera konstruktorer (Overloading)

```csharp
public class Book
{
    public string Title { get; set; }
    public string Author { get; set; }
    public int Pages { get; set; }
    
    // Konstruktor 1
    public Book(string title)
    {
        Title = title;
        Author = "Okänd";
        Pages = 0;
    }
    
    // Konstruktor 2
    public Book(string title, string author)
    {
        Title = title;
        Author = author;
        Pages = 0;
    }
    
    // Konstruktor 3
    public Book(string title, string author, int pages)
    {
        Title = title;
        Author = author;
        Pages = pages;
    }
}

// Olika sätt att skapa böcker
Book book1 = new Book("Harry Potter");
Book book2 = new Book("Harry Potter", "J.K. Rowling");
Book book3 = new Book("Harry Potter", "J.K. Rowling", 223);
```

## Konstruktor med this

```csharp
public class Student
{
    public string Name { get; set; }
    public int Grade { get; set; }
    
    // Enkel konstruktor
    public Student(string name) : this(name, 1)
    {
    }
    
    // Fullständig konstruktor
    public Student(string name, int grade)
    {
        Name = name;
        Grade = grade;
    }
}
```

!!! info "Constructor Chaining"
    Använd `: this()` för att anropa en annan konstruktor och undvika kodupprepning.

## Nästa lektion

Lär dig om [Inkapsling (Encapsulation)](inkapsling.md).
