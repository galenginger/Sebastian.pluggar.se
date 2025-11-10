# Arbetsflöden och Best Practices

Ett bra Git-arbetsflöde är avgörande för ett effektivt team. Här går vi igenom etablerade arbetsflöden och best practices.

## GitFlow - Ett Komplett Arbetsflöde

GitFlow är ett populärt branching-arbetsflöde som definierar specifika grenar för olika syften.

### Branch-struktur

**Permanenta Branches:**

- **main/master**: Produktionskod som alltid är deploybar
- **develop**: Integrationsbranch för utveckling

**Tillfälliga Branches:**

- **feature/**: Nya funktioner (från develop)
- **release/**: Förberedelser för release (från develop)
- **hotfix/**: Akuta bugfixar (från main)

### GitFlow i Praktiken

```bash
# Initiera GitFlow (om du använder git-flow extension)
git flow init

# Skapa en feature
git flow feature start user-login
# Eller manuellt:
git checkout -b feature/user-login develop

# Arbeta på funktionen
git add .
git commit -m "Add login form"

# Avsluta feature
git flow feature finish user-login
# Eller manuellt:
git checkout develop
git merge --no-ff feature/user-login
git branch -d feature/user-login

# Skapa en release
git flow release start 1.2.0
# Gör release-förberedelser (version bumps, dokumentation)
git flow release finish 1.2.0

# Hotfix
git flow hotfix start security-patch
# Fixa buggen
git flow hotfix finish security-patch
```

### Fördelar med GitFlow

- Tydlig struktur
- Parallell utveckling
- Stöd för olika release-cykler
- Enkel hantering av hotfixes

### Nackdelar med GitFlow

- Kan vara överkomplext för små team
- Många branches att hålla reda på
- Långsammare för kontinuerlig deployment

## GitHub Flow - Enklare Arbetsflöde

GitHub Flow är en förenklad variant som passar kontinuerlig deployment.

### Arbetsflöde

1. **main är alltid deploybar**
2. **Skapa en branch** med beskrivande namn
3. **Commita regelbundet** till din branch
4. **Öppna en Pull Request** tidigt
5. **Diskutera och granska** koden
6. **Merga** när den är godkänd
7. **Deploya** omedelbart

```bash
# Skapa feature branch från main
git checkout -b add-payment-integration main

# Arbeta och commita
git add .
git commit -m "Add Stripe API integration"
git push origin add-payment-integration

# Öppna Pull Request på GitHub
# Efter godkännande:
git checkout main
git merge add-payment-integration
git push origin main

# Deploya
# Ta bort branch
git branch -d add-payment-integration
git push origin --delete add-payment-integration
```

### Fördelar med GitHub Flow

- Enkelt och lätt att lära
- Passar kontinuerlig deployment
- Snabb feedback genom PR
- Mindre overhead

## Trunk-Based Development

Ett arbetsflöde där alla utvecklare committar direkt till main (trunk).

### Principer

- Små, frekventa commits till main
- Feature flags för ofärdiga funktioner
- Omfattande automatiserad testning
- Korta feature branches (max några dagar)

```bash
# Kort-livade branches
git checkout -b quick-fix main
# Gör ändring
git commit -am "Fix typo in header"
git push origin quick-fix
# Merga snabbt (samma dag)
```

### När Använda?

- Team med hög disciplin
- Stark CI/CD pipeline
- Mogna testprocesser
- Kontinuerlig deployment

## Commit Best Practices

### Bra Commit-meddelanden

Följ konventionen:

```
Typ: Kort beskrivning (max 50 tecken)

Längre förklaring om vad och varför, inte hur.
Bryt rader vid 72 tecken.

Referens till issue: #123
```

**Vanliga typer:**

- `feat`: Ny funktion
- `fix`: Buggfix
- `docs`: Dokumentationsändringar
- `style`: Formattering (ingen kodändring)
- `refactor`: Omstrukturering av kod
- `test`: Lägga till eller ändra tester
- `chore`: Underhåll, uppdatera dependencies

**Exempel:**

```bash
git commit -m "feat: Add user authentication with JWT

Implement JWT-based authentication system with:
- Login endpoint
- Token generation and validation
- Middleware for protected routes

Closes #42"
```

### Atomic Commits

Varje commit ska vara en logisk enhet:

```bash
# Bra - en ändring per commit
git add auth.js
git commit -m "feat: Add login validation"

git add auth.js
git commit -m "feat: Add password hashing"

# Dåligt - för mycket i en commit
git add .
git commit -m "Add stuff"
```

### Commit Often

```bash
# Commita efter varje logisk ändring
git commit -m "feat: Add user model"
git commit -m "feat: Add user repository"
git commit -m "feat: Add user service"
git commit -m "test: Add user service tests"
```

## .gitignore - Ignorera Filer

En `.gitignore`-fil specificerar vilka filer som inte ska spåras av Git.

### Vanliga Mönster

```gitignore
# Kompilerade filer
*.class
*.dll
*.exe
*.o
*.pyc
*.pyo

# Pakethanterare
node_modules/
vendor/
packages/
*.lock

# Build outputs
bin/
obj/
dist/
build/
out/

# IDE-filer
.vscode/
.idea/
*.swp
*.swo
*~

# OS-filer
.DS_Store
Thumbs.db

# Känslig information
.env
.env.local
secrets.yml
config/secrets.json
*.key
*.pem

# Loggar
*.log
logs/

# Databaser
*.sqlite
*.db

# Temporära filer
tmp/
temp/
*.tmp
```

### Globalt .gitignore

För filer som ska ignoreras i alla projekt:

```bash
# Konfigurera global gitignore
git config --global core.excludesfile ~/.gitignore_global

# Skapa filen
echo ".DS_Store" >> ~/.gitignore_global
echo "*.swp" >> ~/.gitignore_global
```

### Ignorera Redan Spårade Filer

```bash
# Ta bort från Git men behåll lokalt
git rm --cached filename.txt

# För en mapp
git rm --cached -r folder/

# Lägg till i .gitignore
echo "filename.txt" >> .gitignore
git commit -m "Stop tracking filename.txt"
```

## Pull Requests / Merge Requests

### Skapa en Bra PR

**Titel:**
```
feat: Add user authentication system
```

**Beskrivning:**
```markdown
## Changes
- Added JWT authentication
- Created login/logout endpoints
- Added authentication middleware

## Testing
- Unit tests for auth service
- Integration tests for endpoints
- Manual testing completed

## Screenshots
[Add if UI changes]

## Related Issues
Closes #42
Related to #38
```

### Code Review Best Practices

**Som författare:**

- Håll PR:er små och fokuserade
- Skriv tydliga beskrivningar
- Svara konstruktivt på feedback
- Fixa kommentarer snabbt

**Som granskare:**

- Var konstruktiv och respektfull
- Förklara varför, inte bara vad
- Fråga istället för att kräva
- Fokusera på viktig feedback

```bash
# Hämta PR lokalt för testning
git fetch origin pull/123/head:pr-123
git checkout pr-123
```

## Samarbete i Team

### Synkronisera Ofta

```bash
# Innan du börjar arbeta
git pull origin main

# Regelbundet under dagen
git fetch origin
git rebase origin/main
```

### Kommunicera

- Diskutera stora ändringar innan du börjar
- Använd PR-kommentarer för feedback
- Tag:a teammedlemmar när relevant
- Dokumentera viktiga beslut

### Konflikthantering i Team

```bash
# När du får konflikter vid pull
git pull origin main
# CONFLICT!

# Lös konflikter
# Kommunicera med teamet om stora konflikter
git add .
git commit -m "Resolve merge conflicts with main"
git push origin feature-branch
```

## Tags och Versioner

### Semantisk Versionshantering

Följ [SemVer](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: Nya funktioner (bakåtkompatibla)
- **PATCH**: Buggfixar

### Skapa Tags

```bash
# Lightweight tag
git tag v1.2.0

# Annotated tag (rekommenderat)
git tag -a v1.2.0 -m "Release version 1.2.0"

# Tag en specifik commit
git tag -a v1.1.0 abc123 -m "Version 1.1.0"

# Pusha tags
git push origin v1.2.0

# Pusha alla tags
git push origin --tags
```

### Lista och Hantera Tags

```bash
# Lista tags
git tag

# Visa tag-information
git show v1.2.0

# Ta bort tag
git tag -d v1.2.0

# Ta bort remote tag
git push origin --delete v1.2.0
```

## Sammanfattning

Viktiga punkter för ett bra Git-arbetsflöde:

1. **Välj ett arbetsflöde** som passar ditt team
2. **Skriv bra commit-meddelanden** som förklarar varför
3. **Använd .gitignore** för att hålla repo rent
4. **Granska kod** genom Pull Requests
5. **Kommunicera** med teamet
6. **Tagga releases** för enkel versionhantering

Genom att följa dessa best practices kommer ditt team arbeta smidigare och mer effektivt!
