# Avancerade Git-tekniker

När du behärskar grunderna i Git finns det många avancerade tekniker som kan göra dig ännu mer effektiv.

## Rebase - Omskriv Historiken

Rebase låter dig ändra commit-historiken för en renare och mer linjär historik.

### Grundläggande Rebase

```bash
# Istället för merge
git checkout feature-branch
git rebase main

# Detta "flyttar" dina commits till toppen av main
```

**Före rebase:**
```
main:    A---B---C
              \
feature:       D---E
```

**Efter rebase:**
```
main:    A---B---C
                  \
feature:           D'---E'
```

### Interaktiv Rebase

Redigera commit-historiken interaktivt:

```bash
# Redigera de senaste 3 commits
git rebase -i HEAD~3
```

Du får en editor med dina commits:

```
pick abc123 Add login form
pick def456 Fix validation bug
pick ghi789 Update styles

# Commands:
# p, pick = använd commit
# r, reword = ändra commit-meddelande
# e, edit = stanna för att ändra commit
# s, squash = slå samman med föregående commit
# f, fixup = som squash men kasta commit-meddelandet
# d, drop = ta bort commit
```

### Vanliga Användningsområden

**Kombinera commits (squash):**

```bash
git rebase -i HEAD~3
# Ändra till:
pick abc123 Add login form
squash def456 Fix validation bug
squash ghi789 Update styles

# Resulterar i en commit med alla ändringar
```

**Ändra commit-meddelande:**

```bash
git rebase -i HEAD~1
# Ändra 'pick' till 'reword'
```

**Dela upp en commit:**

```bash
git rebase -i HEAD~1
# Ändra 'pick' till 'edit'
# När rebase stannar:
git reset HEAD^
git add file1.js
git commit -m "First change"
git add file2.js
git commit -m "Second change"
git rebase --continue
```

!!! danger "Viktigt"
    Använd ALDRIG rebase på publika branches som andra arbetar på! Det ändrar commit-historiken och skapar problem för andra.

## Cherry-pick - Välj Specifika Commits

Cherry-pick låter dig applicera specifika commits från en branch till en annan.

```bash
# Applicera en specifik commit
git cherry-pick abc123

# Applicera flera commits
git cherry-pick abc123 def456 ghi789

# Cherry-pick utan att commita direkt
git cherry-pick -n abc123
```

### Användningsområden

- Porta en buggfix från develop till en release-branch
- Flytta en commit som hamnade i fel branch
- Applicera hotfixes selektivt

```bash
# Exempel: Porta buggfix från develop till release
git checkout release/1.2.0
git cherry-pick abc123
git push origin release/1.2.0
```

## Git Stash - Avancerad Användning

### Stash med Namn

```bash
# Spara med beskrivande namn
git stash save "WIP: Login feature - half done"

# Lista stashes
git stash list
# stash@{0}: On main: WIP: Login feature - half done
# stash@{1}: On main: Temporary changes
```

### Partiell Stash

```bash
# Stash endast vissa filer
git stash push -m "Stash specific files" file1.js file2.js

# Stash interaktivt
git stash -p
# Git frågar för varje ändring om den ska stashas
```

### Skapa Branch från Stash

```bash
# Skapa en branch med stash-innehållet
git stash branch new-feature-branch stash@{0}
```

## Reflog - Git's Säkerhetsnät

Reflog sparar en historik av var HEAD har pekat. Användbart för att återställa "förlorade" commits.

```bash
# Visa reflog
git reflog

# Typisk output:
# abc123 HEAD@{0}: commit: Add feature
# def456 HEAD@{1}: reset: moving to HEAD^
# ghi789 HEAD@{2}: commit: Bad commit

# Återställ till en tidigare HEAD
git reset --hard HEAD@{2}

# Visa reflog för en specifik branch
git reflog show feature-branch
```

### Återställa Raderade Commits

```bash
# Om du råkade göra git reset --hard
git reflog
# Hitta commit-hashen innan reset
git reset --hard abc123
```

## Git Bisect - Hitta Buggar

Bisect använder binärsökning för att hitta vilken commit som introducerade en bugg.

```bash
# Starta bisect
git bisect start

# Markera nuvarande commit som dålig
git bisect bad

# Markera en känd bra commit
git bisect good abc123

# Git checkar ut en commit i mitten
# Testa om buggen finns
git bisect good  # eller git bisect bad

# Fortsätt tills Git hittar den dåliga commiten
# När du är klar:
git bisect reset
```

### Automatiserad Bisect

```bash
# Använd ett testskript
git bisect start HEAD v1.0
git bisect run npm test

# Git testar automatiskt alla commits
```

## Submodules - Projekt inom Projekt

Submodules låter dig inkludera andra Git-repositories i ditt projekt.

### Lägg till Submodule

```bash
# Lägg till ett submodule
git submodule add https://github.com/user/library.git libs/library

# Klona ett projekt med submodules
git clone https://github.com/user/project.git
git submodule init
git submodule update

# Eller i ett kommando:
git clone --recurse-submodules https://github.com/user/project.git
```

### Arbeta med Submodules

```bash
# Uppdatera alla submodules
git submodule update --remote

# Gå in i submodule och arbeta
cd libs/library
git checkout main
git pull

# Commita ändringen i parent repository
cd ../..
git add libs/library
git commit -m "Update library submodule"
```

### Ta bort Submodule

```bash
# Ta bort från .gitmodules
git submodule deinit libs/library

# Ta bort från .git/config och working directory
git rm libs/library

# Commita ändringen
git commit -m "Remove library submodule"
```

## Git Worktree - Flera Working Directories

Worktrees låter dig ha flera working directories för samma repository.

```bash
# Skapa en ny worktree för en branch
git worktree add ../project-hotfix hotfix/security

# Lista worktrees
git worktree list

# Arbeta i den nya directoryn
cd ../project-hotfix
# Gör ändringar
git commit -am "Fix security issue"

# Ta bort worktree
git worktree remove ../project-hotfix
```

### Användningsområden

- Jobba på flera branches samtidigt
- Kör tester på en branch medan du utvecklar på en annan
- Granska Pull Requests utan att störa ditt arbete

## Git Hooks - Automatisera Arbetsflöden

Hooks är skript som körs automatiskt vid vissa Git-händelser.

### Vanliga Hooks

```bash
# Pre-commit: Körs innan commit
.git/hooks/pre-commit

# Exempel: Kör linter
#!/bin/sh
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed. Commit aborted."
    exit 1
fi
```

**Andra användbara hooks:**

- `pre-push`: Körs innan push (kör tester)
- `commit-msg`: Validera commit-meddelanden
- `post-merge`: Körs efter merge (uppdatera dependencies)

### Skapa en Hook

```bash
# Navigera till hooks-mappen
cd .git/hooks

# Skapa ett skript
cat > pre-commit << 'EOF'
#!/bin/sh
echo "Running tests before commit..."
npm test
EOF

# Gör det exekverbart
chmod +x pre-commit
```

## Git LFS - Large File Storage

LFS hanterar stora filer effektivt genom att lagra dem externt.

### Installera och Konfigurera

```bash
# Installera Git LFS
git lfs install

# Spåra stora filer
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "videos/*.mp4"

# Lägg till .gitattributes
git add .gitattributes
git commit -m "Add LFS tracking"

# Lägg till stora filer som vanligt
git add large-file.psd
git commit -m "Add design file"
git push
```

### Arbeta med LFS

```bash
# Se vilka filer som spåras av LFS
git lfs ls-files

# Hämta LFS-filer
git lfs pull

# Se LFS-status
git lfs status
```

## Git Archive - Exportera Repository

Skapa en arkivfil av ditt repository:

```bash
# Skapa ZIP-arkiv
git archive --format=zip --output=project-v1.0.zip main

# Skapa tar.gz-arkiv
git archive --format=tar.gz --output=project-v1.0.tar.gz main

# Arkivera en specifik commit
git archive --format=zip --output=release.zip abc123

# Arkivera endast en mapp
git archive --format=zip --output=docs.zip main:docs/
```

## Sammanfattning

Avancerade Git-tekniker ger dig:

- **Rebase**: Renare commit-historik
- **Cherry-pick**: Selektivt applicera commits
- **Reflog**: Återställ "förlorade" ändringar
- **Bisect**: Hitta buggar effektivt
- **Submodules**: Hantera dependencies
- **Worktree**: Flera working directories
- **Hooks**: Automatisera arbetsflöden
- **LFS**: Hantera stora filer

Dessa verktyg gör dig till en mer effektiv Git-användare, men använd dem med omdöme!
