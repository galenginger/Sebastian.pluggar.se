# 📚 Sebastian.pluggar.se - Dokumentation

En modern webbplats för OOP-kurs i C#, byggd med MkDocs Material och hostad på GitHub Pages.

## 🌐 Live Webbplats
**[https://galenginger.github.io/Sebastian.pluggar.se/](https://galenginger.github.io/Sebastian.pluggar.se/)**

---

## 📋 Innehållsförteckning
- [Komma Igång](#-komma-igång)
- [Förhandsgranska Lokalt](#-förhandsgranska-lokalt)
- [Lägga Till Nytt Innehåll](#-lägga-till-nytt-innehåll)
- [Ändra Befintligt Innehåll](#-ändra-befintligt-innehåll)
- [Publicera Ändringar](#-publicera-ändringar)
- [Projektstruktur](#-projektstruktur)
- [Anpassa Design](#-anpassa-design)
- [Felsökning](#-felsökning)

---

## 🚀 Komma Igång

### Förutsättningar
Du behöver ha följande installerat på din dator:
- **Python 3.8+** - [Ladda ner här](https://www.python.org/downloads/)
- **Git** - [Ladda ner här](https://git-scm.com/downloads)
- **VS Code** (rekommenderat) - [Ladda ner här](https://code.visualstudio.com/)

### Installation

1. **Öppna PowerShell eller Terminal**

2. **Navigera till projektmappen:**
```powershell
cd C:\Users\sebas\OneDrive\Skrivbord\SebastiansOOPSkola\classroom
```

3. **Installera MkDocs och tema (första gången):**
```powershell
pip install -r requirements.txt
```

Det är det! Nu är allt klart att användas.

---

## 👀 Förhandsgranska Lokalt

**Innan du publicerar ändringar, vill du alltid se hur det ser ut:**

1. **Starta utvecklingsservern:**
```powershell
python -m mkdocs serve
```

2. **Öppna webbläsaren och gå till:**
```
http://127.0.0.1:8000/Sebastian.pluggar.se/
```

3. **Ändringar uppdateras automatiskt** - När du sparar en fil, uppdateras webbläsaren direkt!

4. **Stoppa servern** - Tryck `Ctrl+C` i terminalen när du är klar.

---

## ➕ Lägga Till Nytt Innehåll

### 1. Skapa en Ny Lektion

**Steg-för-steg:**

1. **Bestäm vilken kategori lektionen tillhör:**
   - `docs/grunderna/` - Grundläggande OOP-koncept (lektion 1-10)
   - `docs/koncept/` - Viktiga C#-koncept (lektion 11-16)
   - `docs/avancerat/` - Moderna C# features (lektion 17-22)
   - `docs/praktik/` - Praktiska tillämpningar (lektion 23-28)

2. **Skapa en ny Markdown-fil:**
   - Högerklicka på rätt mapp i VS Code
   - Välj "New File"
   - Namnge filen: `mitt-amne.md` (använd små bokstäver och bindestreck)

3. **Lägg till innehåll i filen:**
```markdown
# Titel på Lektionen

## Introduktion
Beskriv vad lektionen handlar om...

## Huvudinnehåll
Förklara konceptet här...

```csharp
// Din C#-kod här
public class Exempel {
    // ...
}
```

## Sammanfattning
- Punkt 1
- Punkt 2

## Övningar
1. Uppgift 1
2. Uppgift 2
```

4. **Lägg till i navigationsmeny:**
   - Öppna `docs/.nav.yml`
   - Hitta rätt sektion
   - Lägg till din fil:
```yaml
- 🎯 Grunderna:
  - grunderna/index.md
  - grunderna/introduktion.md
  - grunderna/mitt-amne.md  # <-- Din nya fil!
```

5. **Förhandsgranska:**
```powershell
python -m mkdocs serve
```

### 2. Lägga Till Projekt-Sektion

**För att lägga till dina egna projekt:**

1. **Skapa projektmapp:**
```powershell
mkdir docs\projekt
```

2. **Skapa index-fil för projekt:**
Skapa `docs/projekt/index.md`:
```markdown
# 💼 Mina Projekt

Här hittar du alla projekt jag har byggt under kursen.

## Projekt-Lista

### 1. Projektnamn
**Beskrivning:** Kort beskrivning av projektet...

**Tekniker:** C#, .NET, SQL, etc.

[Se projektet →](projekt1.md)

---

### 2. Annat Projekt
...
```

3. **Lägg till projekt i navigation:**
Öppna `docs/.nav.yml` och lägg till:
```yaml
- 💼 Projekt:
  - projekt/index.md
  - projekt/projekt1.md
  - projekt/projekt2.md
```

4. **Skapa sidor för varje projekt:**
Skapa `docs/projekt/projekt1.md`:
```markdown
# Projektnamn

## Översikt
Vad projektet gör...

## Tekniker
- C# 12
- .NET 8
- SQL Server

## Källkod
```csharp
// Din kod här
```

## Screenshots
![Beskrivning](../assets/images/projekt1-screenshot.png)

## GitHub Repository
[Se källkod på GitHub →](https://github.com/dittanvändarnamn/projekt-namn)
```

---

## ✏️ Ändra Befintligt Innehåll

### Ändra Text på Hemsidan

1. **Öppna `docs/index.md`** - Detta är startsidan

2. **Hitta det du vill ändra:**
   - Titlar är markerade med `#` eller `##`
   - Vanlig text är utan markeringar
   - Länkar ser ut så här: `[Text](länk.md)`

3. **Gör dina ändringar och spara**

4. **Förhandsgranska:**
```powershell
python -m mkdocs serve
```

### Ändra en Lektion

1. **Öppna rätt fil** i `docs/grunderna/`, `docs/koncept/`, etc.

2. **Redigera innehållet**

3. **Spara och förhandsgranska**

### Byta Namn på en Fil

**OBS:** Var försiktig när du byter namn, eftersom det kan bryta länkar!

1. **Byt namn på filen** i filutforskaren eller VS Code

2. **Uppdatera `docs/.nav.yml`** med det nya filnamnet

3. **Hitta alla länkar till filen:**
```powershell
# Sök efter gamla filnamnet
grep -r "gamla-namnet.md" docs/
```

4. **Uppdatera alla länkar** som pekar till filen

---

## 🚀 Publicera Ändringar

**När du är nöjd med dina ändringar och vill publicera dem på webben:**

### Steg 1: Spara i Git

```powershell
# Se vilka filer som ändrats
git status

# Lägg till alla ändringar
git add .

# Spara med ett meddelande (ändra texten till vad du gjort)
git commit -m "Lagt till ny lektion om arv"
```

### Steg 2: Skicka till GitHub

```powershell
git push
```

### Steg 3: Vänta på Deploy

- GitHub Actions bygger automatiskt sidan (tar 2-3 minuter)
- Gå till [Actions-fliken](https://github.com/galenginger/Sebastian.pluggar.se/actions) för att se status
- När den är klar (grön bock ✓), är sidan uppdaterad!

### Steg 4: Kontrollera Live-Sidan

- Besök: [https://galenginger.github.io/Sebastian.pluggar.se/](https://galenginger.github.io/Sebastian.pluggar.se/)
- **Tryck Ctrl+Shift+R** för att tvinga webbläsaren att ladda om (hård refresh)

---

## 📁 Projektstruktur

```
classroom/
├── docs/                      # Allt innehåll finns här
│   ├── index.md              # Hemsidan (startsidan)
│   ├── kursoversikt.md       # Fullständig kursöversikt
│   ├── .nav.yml              # Navigationsmeny (sidofältet)
│   │
│   ├── grunderna/            # Lektion 1-10
│   │   ├── index.md
│   │   ├── introduktion.md
│   │   └── ...
│   │
│   ├── koncept/              # Lektion 11-16
│   │   ├── index.md
│   │   └── ...
│   │
│   ├── avancerat/            # Lektion 17-22
│   │   ├── index.md
│   │   └── ...
│   │
│   ├── praktik/              # Lektion 23-28
│   │   ├── index.md
│   │   └── ...
│   │
│   └── assets/               # CSS, bilder, JavaScript
│       └── stylesheets/
│           └── extra.css     # All custom styling
│
├── mkdocs.yml                # Huvudkonfiguration
├── requirements.txt          # Python-paket som behövs
└── README.md                 # Denna fil!
```

---

## 🎨 Anpassa Design

### Ändra Färger

1. **Öppna `docs/assets/stylesheets/extra.css`**

2. **Hitta gradient-färgerna:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

3. **Byt ut färgkoderna:**
   - `#667eea` - Första färgen (blå-lila)
   - `#764ba2` - Andra färgen (lila)
   - Använd [coolors.co](https://coolors.co) för att hitta fina färger

4. **Sök och ersätt i hela filen** - Tryck `Ctrl+H` i VS Code

### Ändra Typsnitt

1. **Öppna `mkdocs.yml`**

2. **Hitta `theme` → `font`:**
```yaml
theme:
  font:
    text: Inter          # Ändra detta
    code: JetBrains Mono # Eller detta
```

3. **Välj från [Google Fonts](https://fonts.google.com/):**
   - Roboto
   - Open Sans
   - Lato
   - Poppins
   - etc.

### Ändra Layout på Hemsidan

1. **Öppna `docs/index.md`**

2. **Hitta sektioner med HTML:**
```html
<div class="compact-grid">
  <div class="compact-card">
    <!-- Innehåll här -->
  </div>
</div>
```

3. **Ändra ordning** - Klipp ut och klistra in hela `<div class="compact-card">...</div>` block

4. **Ta bort sektion** - Ta bort hela div-blocket

5. **Lägg till ny sektion** - Kopiera ett befintligt kort och ändra innehållet

### Ändra Bilder/Ikoner

**Emojis används för ikoner (💻 🎯 🔨 etc.):**

1. **Kopiera emoji från [Emojipedia](https://emojipedia.org/)**

2. **Klistra in i din Markdown-fil**

**Lägga till bilder:**

1. **Lägg bilden i `docs/assets/images/`**

2. **Referera i Markdown:**
```markdown
![Beskrivning](assets/images/min-bild.png)
```

---

## 🛠️ Felsökning

### Problem: "mkdocs: command not found"

**Lösning:**
```powershell
pip install mkdocs-material
```

### Problem: Sidan ser fel ut lokalt

**Lösning:**
1. Stoppa servern (Ctrl+C)
2. Starta om:
```powershell
python -m mkdocs serve
```
3. Hård refresh i webbläsare (Ctrl+Shift+R)

### Problem: Ändringar syns inte på live-sidan

**Lösning:**
1. Kontrollera att du pushat:
```powershell
git status  # Ska säga "nothing to commit, working tree clean"
```

2. Kolla GitHub Actions:
   - Gå till [Actions](https://github.com/galenginger/Sebastian.pluggar.se/actions)
   - Se att senaste bygget är grönt ✓

3. Vänta 2-3 minuter efter deploy

4. Hård refresh (Ctrl+Shift+R) i webbläsare

### Problem: Navigation fungerar inte

**Lösning:**
1. Öppna `docs/.nav.yml`
2. Kontrollera indenteringen (2 mellanslag per nivå)
3. Kontrollera att alla filsökvägar stämmer

**Exempel på korrekt YAML:**
```yaml
- 🎯 Grunderna:           # 0 mellanslag
  - grunderna/index.md    # 2 mellanslag
  - grunderna/intro.md    # 2 mellanslag
```

### Problem: Länkar är brutna (404)

**Lösning:**
1. Kontrollera stavningen på filnamnet
2. Använd relativa länkar:
   - `[Text](../koncept/static.md)` - Upp en nivå, sedan in i koncept
   - `[Text](arv.md)` - Samma mapp

### Problem: CSS ändras inte

**Lösning:**
1. Kontrollera att `extra.css` är listad i `mkdocs.yml`:
```yaml
extra_css:
  - assets/stylesheets/extra.css
```

2. Hård refresh (Ctrl+Shift+R)

---

## 📝 Användbara Kommandon

```powershell
# Starta lokal server
python -m mkdocs serve

# Stoppa servern
Ctrl+C

# Se ändringar
git status

# Spara ändringar
git add .
git commit -m "Ditt meddelande"

# Publicera
git push

# Uppdatera från GitHub (om du jobbar från flera datorer)
git pull

# Bygg statisk site (sker automatiskt på GitHub)
mkdocs build
```

---

## 🎓 Markdown Snabbreferens

```markdown
# Stor rubrik (H1)
## Mellanstor rubrik (H2)
### Liten rubrik (H3)

**Fet text**
*Kursiv text*

- Punkt 1
- Punkt 2

1. Numrerad 1
2. Numrerad 2

[Länktext](url-eller-fil.md)

![Bildbeskrivning](sökväg/till/bild.png)

`inline kod`

```csharp
// Kodblock
public class Exempel {
    // ...
}
```

> Citat eller notering

---  (horisontell linje)
```

---

## 🤝 Tips & Tricks

### Jobba Säkert
- **Föhandsgranska alltid lokalt** innan du pushar
- **Gör små commits** med tydliga meddelanden
- **Testa alla länkar** efter ändringar

### Organisera Innehåll
- **Ett koncept per fil** - Håll filer fokuserade
- **Använd tydliga filnamn** - `arv-och-polymorfism.md` istället för `lektion5.md`
- **Gruppera relaterat innehåll** - Skapa undermappar vid behov

### Skriv Bra Innehåll
- **Börja med introduktion** - Förklara vad som ska läras
- **Använd kodexempel** - Visa, berätta inte bara
- **Lägg till övningar** - Praktik ger förståelse
- **Sammanfatta** - Upprepa huvudpunkter

### Optimera för Mobil
- **Håll textstycken korta** - Max 3-4 meningar
- **Använd punktlistor** - Lättare att läsa
- **Bryt upp långa kodblock** - Visa bara relevant del
- **Testa på mobil** - Öppna 127.0.0.1:8000 på din telefon (samma nätverk)

---

## 📞 Hjälp & Resurser

### MkDocs Dokumentation
- [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) - Officiell dokumentation
- [Markdown Guide](https://www.markdownguide.org/) - Lär dig Markdown

### Git & GitHub
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics) - Git grunderna
- [GitHub Guides](https://guides.github.com/) - GitHub tutorials

### Inspiration
- [Material Demo](https://squidfunk.github.io/mkdocs-material/reference/) - Se vad som är möjligt
- [Real Python](https://realpython.com/) - Bra exempel på teknisk dokumentation

---

## ✅ Checklista för Nya Lektioner

- [ ] Skapa Markdown-fil i rätt mapp
- [ ] Skriv tydlig rubrik och introduktion
- [ ] Lägg till kodexempel
- [ ] Inkludera övningar/uppgifter
- [ ] Uppdatera `docs/.nav.yml`
- [ ] Förhandsgranska lokalt (`mkdocs serve`)
- [ ] Testa alla länkar
- [ ] Commit med tydligt meddelande
- [ ] Push till GitHub
- [ ] Vänta på deploy (2-3 min)
- [ ] Kontrollera live-sidan

---

## 🎉 Du är redo!

Nu har du allt du behöver för att:
- ✅ Lägga till nytt innehåll
- ✅ Redigera befintliga lektioner
- ✅ Lägga till dina projekt
- ✅ Anpassa design
- ✅ Publicera ändringar

**Lycka till med utvecklingen av din kurs-webbplats!** 🚀

---

**Skapat:** 2025-01-09  
**Version:** 1.0  
**Författare:** Sebastian
