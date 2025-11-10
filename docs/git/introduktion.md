# Introduktion till Git

Git är ett distribuerat versionshanteringssystem som skapades av Linus Torvalds 2005 för att hantera utvecklingen av Linuxkärnan. Idag är Git den överlägset mest använda versionshanteringsplattformen i världen och har blivit en oumbärlig del av modern mjukvaruutveckling.

## Vad är Versionshantering?

Versionshantering är processen att spåra och hantera förändringar i kod över tid. Det löser fundamentala problem som alla utvecklare möter:

- **Historik**: Varje förändring sparas med information om vem som gjorde den, när den gjordes, och varför
- **Samarbete**: Flera utvecklare kan arbeta på samma projekt samtidigt utan att skriva över varandras arbete
- **Återställning**: Möjlighet att gå tillbaka till tidigare versioner om något går fel
- **Experimentering**: Skapa grenar (branches) för att testa nya funktioner utan att påverka huvudkoden

## Grundläggande Koncept

### Repository (Repo)

Ett repository är en lagringsenhet som innehåller alla filer i ditt projekt samt hela historiken av förändringar. Det finns två typer:

- **Lokalt repository**: Finns på din egen dator och innehåller hela projekthistoriken
- **Remote repository**: Finns på en server (som GitHub, GitLab, eller Bitbucket) och används för backup och samarbete

### Commits

En commit är en ögonblicksbild av ditt projekt vid en specifik tidpunkt. Varje commit innehåller:

- De ändringar som gjorts
- Ett meddelande som beskriver ändringarna
- Information om författaren
- En unik identifierare (SHA-hash)

### Branches (Grenar)

Branches låter dig skapa separata utvecklingslinjer. Huvudgrenen kallas traditionellt "master" eller "main", men du kan skapa hur många grenar du vill för olika funktioner eller experiment.

### Staging Area

Staging area (eller "index") är ett mellansteg mellan dina arbetsfiler och repository. Här väljer du vilka ändringar som ska inkluderas i nästa commit.

## Varför Git?

Git har blivit industristandard av flera anledningar:

1. **Distribuerad arkitektur**: Varje utvecklare har en komplett kopia av projekthistoriken
2. **Snabbhet**: De flesta operationer körs lokalt och är extremt snabba
3. **Kraftfull branching**: Skapa och hantera branches enkelt och effektivt
4. **Integritet**: SHA-1 checksummor säkerställer dataintegriteten
5. **Flexibilitet**: Stöder många olika arbetsflöden och arbetssätt

## Kom Igång

För att börja använda Git behöver du:

1. **Installera Git**: Ladda ner från [git-scm.com](https://git-scm.com/)
2. **Konfigurera Git**: Ställ in ditt namn och e-post
3. **Lär dig grunderna**: Börja med de vanligaste kommandona

I nästa kapitel går vi igenom de grundläggande kommandona och arbetsflödena!
