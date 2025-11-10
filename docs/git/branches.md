# Branches och Arbetsflöden

Branches (grenar) är en av Gits mest kraftfulla funktioner. De låter dig arbeta på olika funktioner parallellt utan att påverka huvudkoden.

## Grundläggande Branching

### Vad är en Branch?

En branch är en pekare till en specifik commit i din projekthistorik. När du skapar en ny branch skapar du en ny utvecklingslinje som kan avvika från huvudgrenen.

```bash
# Skapa en ny branch
git branch feature-login

# Byt till den nya branchen
git checkout feature-login

# Eller gör båda samtidigt
git checkout -b feature-login
```

### Varför Använda Branches?

- **Isolerad utveckling**: Arbeta på nya funktioner utan att påverka huvudkoden
- **Experimentering**: Testa idéer utan risk
- **Parallellt arbete**: Flera utvecklare kan arbeta på olika funktioner samtidigt
- **Code review**: Granska ändringar innan de mergas till main

## Branching-strategier

### Feature Branch Workflow

Den vanligaste strategin - skapa en ny branch för varje funktion:

```bash
# Skapa en feature branch
git checkout -b feature/user-authentication

# Arbeta på funktionen
git add .
git commit -m "Add login form"
git commit -m "Add password validation"

# När funktionen är klar, merga tillbaka
git checkout main
git merge feature/user-authentication

# Ta bort branchen
git branch -d feature/user-authentication
```

### GitFlow

Ett mer strukturerat arbetsflöde med specifika branches för olika syften:

- **main**: Produktionskod som alltid är deploybar
- **develop**: Integrationsbranch för utveckling
- **feature/**: Nya funktioner (skapas från develop)
- **release/**: Förberedelser för release
- **hotfix/**: Akuta bugfixar i produktion

```bash
# Skapa en feature branch från develop
git checkout develop
git checkout -b feature/new-dashboard

# När funktionen är klar
git checkout develop
git merge feature/new-dashboard

# Förbered en release
git checkout -b release/1.2.0 develop

# När release är klar, merga till både main och develop
git checkout main
git merge release/1.2.0
git checkout develop
git merge release/1.2.0
```

### GitHub Flow

En enklare variant, populär för kontinuerlig deployment:

1. Skapa en branch från main
2. Gör commits
3. Öppna en Pull Request
4. Diskutera och granska kod
5. Merga till main
6. Deploya

```bash
git checkout -b add-payment-feature
# Gör ändringar
git push origin add-payment-feature
# Skapa Pull Request på GitHub
```

## Merging

### Fast-Forward Merge

När ingen utveckling har skett på main-branchen:

```bash
git checkout main
git merge feature-branch
# Git "flyttar fram" main-pekaren
```

### Three-Way Merge

När båda branches har nya commits:

```bash
git checkout main
git merge feature-branch
# Git skapar en merge-commit
```

### Merge med Meddelande

```bash
git merge feature-branch -m "Merge feature: Add user dashboard"
```

## Konflikthantering

När flera personer ändrar samma kod uppstår konflikter:

### Identifiera Konflikter

```bash
git merge feature-branch
# CONFLICT (content): Merge conflict in app.js
```

Git markerar konflikter i filen:

```javascript
<<<<<<< HEAD
function login(username, password) {
    // Din version
=======
function login(email, password) {
    // Deras version
>>>>>>> feature-branch
}
```

### Lösa Konflikter

1. Öppna filen och välj vilken version du vill behålla
2. Ta bort konfliktmarkörerna (`<<<<<<<`, `=======`, `>>>>>>>`)
3. Stage filen: `git add app.js`
4. Slutför mergen: `git commit`

```bash
# Visa konflikter
git status

# Redigera filen manuellt
# Eller använd merge tool
git mergetool

# När du löst konflikterna
git add .
git commit -m "Resolve merge conflicts"
```

### Avbryta en Merge

```bash
# Om du vill börja om
git merge --abort
```

## Rebase

Rebase är ett alternativ till merge som skapar en renare historik:

```bash
# Istället för merge
git checkout feature-branch
git rebase main

# Detta "flyttar" dina commits till toppen av main
```

### Interaktiv Rebase

Låter dig redigera commit-historiken:

```bash
git rebase -i HEAD~3

# Du kan:
# - pick: behåll commit
# - reword: ändra commit-meddelande
# - squash: kombinera med föregående commit
# - drop: ta bort commit
```

!!! warning "Varning"
    Använd aldrig rebase på publika branches som andra arbetar på!

## Avancerade Branch-kommandon

### Byt Branch med Ändringar

```bash
# Om du har osparade ändringar
git stash
git checkout other-branch
git stash pop
```

### Se Skillnader Mellan Branches

```bash
# Jämför två branches
git diff main..feature-branch

# Se vilka commits som finns i en branch
git log main..feature-branch
```

### Cherry-pick

Applicera specifika commits från en branch till en annan:

```bash
git checkout main
git cherry-pick abc123
```

### Remote Branches

```bash
# Se alla branches (inklusive remote)
git branch -a

# Skapa en lokal branch från remote
git checkout -b feature-branch origin/feature-branch

# Enklare i nyare Git:
git checkout feature-branch

# Pusha en ny branch till remote
git push -u origin feature-branch

# Ta bort remote branch
git push origin --delete feature-branch
```

## Best Practices

### Branch-namngivning

Använd beskrivande namn:

```bash
# Bra
git checkout -b feature/user-authentication
git checkout -b bugfix/login-error
git checkout -b hotfix/security-patch

# Dåligt
git checkout -b fix
git checkout -b temp
git checkout -b test123
```

### Håll Branches Uppdaterade

```bash
# Synkronisera ofta med main
git checkout feature-branch
git pull origin main
```

### Städa Regelbundet

```bash
# Ta bort mergade branches lokalt
git branch --merged | grep -v "main" | xargs git branch -d

# Lista remote branches som är borttagna
git remote prune origin --dry-run

# Ta bort dem
git remote prune origin
```

## Vanliga Scenarier

### Scenario 1: Byta Branch med Osparade Ändringar

```bash
# Använd stash
git stash
git checkout other-branch
git stash pop
```

### Scenario 2: Merga Utan Merge-commit

```bash
git merge --squash feature-branch
git commit -m "Add complete feature X"
```

### Scenario 3: Återställa en Branch

```bash
# Återställ till en tidigare commit
git reset --hard abc123

# Eller återställ till remote version
git reset --hard origin/main
```

## Sammanfattning

Branches är centrala i Git-arbetsflöden:

- **Skapa branches** för varje funktion eller bugfix
- **Använd merge** för att integrera ändringar
- **Hantera konflikter** systematiskt
- **Städa regelbundet** för att hålla repo rent
- **Följ en strategi** som passar ditt team

Genom att bemästra branching kan du arbeta effektivare och säkrare i dina projekt!
