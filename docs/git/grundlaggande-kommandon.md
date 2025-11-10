# Vanliga Git-kommandon

Här lär du dig de vanligaste Git-kommandona som du kommer använda dagligen i din utveckling.

## Grundläggande Arbetsflöde

### Initiera och Klona

```bash
# Initiera ett nytt repository
git init

# Klona ett befintligt repository
git clone https://github.com/user/repo.git
```

### Status och Ändringar

```bash
# Se status på dina filer
git status

# Se ändringar i en fil
git diff filename.txt

# Se ändringar som är staged
git diff --staged
```

### Staging och Commit

```bash
# Lägg till filer till staging area
git add filename.txt

# Lägg till alla ändringar
git add .

# Skapa en commit
git commit -m "Beskrivande meddelande"

# Lägg till och commita i ett steg (endast för modifierade filer)
git commit -am "Beskrivande meddelande"
```

### Push och Pull

```bash
# Skicka ändringar till remote repository
git push origin main

# Hämta ändringar från remote repository
git pull origin main

# Hämta information om remote utan att merga
git fetch origin
```

## Historik och Inspektion

### Se Commit-historik

```bash
# Se commit-historik
git log

# Kompakt vy (en rad per commit)
git log --oneline

# Grafisk representation
git log --graph

# Visa commits från en specifik författare
git log --author="Sebastian"

# Visa commits för en specifik fil
git log -- filename.txt
```

### Inspektera Ändringar

```bash
# Se vem som ändrade varje rad
git blame filename.txt

# Visa en specifik commit
git show abc123

# Sök i commit-meddelanden
git log --grep="bugfix"
```

## Ångra Ändringar

### Återställa Filer

```bash
# Ångra ändringar i working directory
git checkout -- filename.txt

# I nyare Git-versioner (rekommenderat)
git restore filename.txt

# Ta bort fil från staging area
git reset HEAD filename.txt

# I nyare Git-versioner (rekommenderat)
git restore --staged filename.txt
```

### Ångra Commits

```bash
# Ångra senaste commit (behåll ändringar)
git reset --soft HEAD~1

# Ångra senaste commit (behåll ändringar i working directory)
git reset --mixed HEAD~1

# Ångra senaste commit (ta bort ändringar PERMANENT)
git reset --hard HEAD~1

# Skapa en ny commit som ångrar en tidigare commit
git revert abc123
```

!!! warning "Varning"
    Var försiktig med `git reset --hard` - det tar bort ändringar permanent!

## Branch-hantering

### Skapa och Byta Branches

```bash
# Lista alla branches
git branch

# Skapa en ny branch
git branch feature-login

# Byt till en branch
git checkout feature-login

# Skapa och byt till en ny branch samtidigt
git checkout -b feature-login

# I nyare Git-versioner (rekommenderat)
git switch feature-login
git switch -c feature-login
```

### Merga och Ta Bort

```bash
# Merga en branch till nuvarande branch
git merge feature-login

# Ta bort en branch
git branch -d feature-login

# Tvinga borttagning (även om den inte är mergad)
git branch -D feature-login

# Ta bort remote branch
git push origin --delete feature-login
```

## Stashing

Stashing låter dig temporärt spara ändringar utan att commita dem:

```bash
# Spara ändringar
git stash

# Spara med ett meddelande
git stash save "Work in progress on login feature"

# Lista alla stashes
git stash list

# Återställ senaste stash
git stash pop

# Återställ en specifik stash
git stash apply stash@{2}

# Ta bort en stash
git stash drop stash@{0}

# Ta bort alla stashes
git stash clear
```

## Remote Repositories

### Hantera Remotes

```bash
# Lista remotes
git remote -v

# Lägg till en remote
git remote add origin https://github.com/user/repo.git

# Byt URL för en remote
git remote set-url origin https://github.com/user/new-repo.git

# Ta bort en remote
git remote remove origin
```

### Synkronisera

```bash
# Hämta alla branches från remote
git fetch --all

# Synkronisera din branch med remote
git pull --rebase origin main

# Pusha alla branches
git push --all origin
```

## Tips och Tricks

### Alias

Skapa genvägar för vanliga kommandon:

```bash
# Lägg till i din Git-konfiguration
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
```

Nu kan du använda:
```bash
git st    # istället för git status
git co    # istället för git checkout
git br    # istället för git branch
```

### Användbara Kommandon

```bash
# Se vilka filer som är ignorerade
git status --ignored

# Visa konfiguration
git config --list

# Rensa untracked filer
git clean -n    # Förhandsgranska
git clean -f    # Ta bort filer
git clean -fd   # Ta bort filer och mappar
```

## Sammanfattning

De vanligaste kommandona du kommer använda dagligen är:

1. `git status` - Se vad som har ändrats
2. `git add` - Stage filer för commit
3. `git commit` - Spara ändringar
4. `git push` - Skicka till remote
5. `git pull` - Hämta från remote
6. `git checkout -b` - Skapa ny branch

Lär dig dessa kommandon ordentligt, så kommer resten falla på plats naturligt!
