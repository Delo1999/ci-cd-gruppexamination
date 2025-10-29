# Git Flow Guide

Detta dokument förklarar hur ni arbetar med git flow i detta projekt.

## Varför Git Flow?

Git flow hjälper till att:

- ✅ Organisera utveckling tydligt
- ✅ Hålla main branch stabil
- ✅ Göra code review en naturlig del av processen
- ✅ Simulera en riktig utvecklingskedja

## Branch Strategi

### 1. `main` branch

- **Syfte**: Produktionsbranch, alltid deployment-ready
- **Skyddad**: ❌ Ingen kan pusha direkt
- **Deployment**: Automatisk deployment till produktion vid merge

### 2. `dev` branch

- **Syfte**: Utvecklingsbranch där alla features samlas
- **Skyddad**: ⚠️ Kräver PR och review (rekommenderat)
- **Merges från**: Feature branches
- **Merges till**: `main` när ni är redo för produktion

### 3. `feature/*` branches

- **Syfte**: Ett feature/user story per branch
- **Skapas från**: `dev`
- **Merges till**: `dev` via PR

## Workflow Exempel

### Skapa och arbeta med en feature branch

```bash
# 1. Säkerställ att du är på dev och uppdaterad
git checkout dev
git pull origin dev

# 2. Skapa ny feature branch
git checkout -b feature/view-meetups

# 3. Arbeta och committa
git add .
git commit -m "feat: implementera lista över meetups"

# 4. Pusha till GitHub
git push -u origin feature/view-meetups

# 5. Skapa Pull Request på GitHub till dev
#    - Lägg till beskrivning
#    - Tagga meddelanden som [WIP] om work in progress
#    - Be om review från teamet

# 6. Efter review och approval: merge till dev
#    - Klicka "Merge pull request" på GitHub
#    - Ta bort feature branch efter merge (GitHub gör detta automatiskt)

# 7. Uppdatera din lokala dev
git checkout dev
git pull origin dev
```

### Merga dev till main (för produktion)

```bash
# 1. Säkerställ att dev är uppdaterad och testad
git checkout dev
git pull origin dev

# 2. Skapa PR från dev till main på GitHub
#    - Detta triggerar deployment workflows
#    - Dubbelkolla att alla features är redo

# 3. Efter merge till main sker automatiskt:
#    - Frontend deployas till S3
#    - Backend deployas till Render

# 4. Tagga release (valfritt men bra praxis)
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Commit Message Konventioner

Använd tydliga commit messages:

- `feat:` Nya features
- `fix:` Bugfixes
- `docs:` Dokumentation
- `style:` Formatering (inget som påverkar kod)
- `refactor:` Refactoring
- `test:` Testar
- `chore:` Bygg-hjälpmedel, konfiguration, etc.

Exempel:

```
feat: lägg till anmälningsformulär för meetups
fix: korrigera CORS-problem i API
docs: uppdatera README med setup-instruktioner
```

## Branch Protection Rules - Detaljerad Guide

### Varför Branch Protection?

- ✅ Förhindrar att någon pushar direkt till main
- ✅ Säkerställer code review
- ✅ Förhindrar merges av broken builds
- ✅ Visar i betygsrapporten att ni följer best practices

### Så här sätter du upp:

1. **Gå till GitHub repo > Settings > Branches**

2. **För main branch:**

   ```
   Branch name pattern: main

   ✅ Require a pull request before merging
      ✅ Require approvals: 1
      ✅ Dismiss stale pull request approvals when new commits are pushed

   ✅ Require status checks to pass before merging
      ✅ Require branches to be up to date before merging
      (Välj relevanta checks här när workflows körs första gången)

   ✅ Require conversation resolution before merging

   ✅ Do not allow bypassing the above settings

   ❌ Allow force pushes (VÄLJ BORT DENNA)
   ❌ Allow deletions (VÄLJ BORT DENNA)
   ```

3. **För dev branch (valfritt men rekommenderat):**

   ```
   Branch name pattern: dev

   ✅ Require a pull request before merging
      ✅ Require approvals: 1

   ✅ Allow force pushes (kan vara användbart under utveckling)
   ```

## Troubleshooting

### "This branch cannot be merged" efter PR

**Problem**: Branch är behind main/dev  
**Lösning**:

```bash
git checkout din-feature-branch
git merge dev  # eller main
# Fixa eventuella konflikter
git push
```

### Jag pushade direkt till main av misstag

**Problem**: Branch protection blockerade det  
**Lösning**: Detta är faktiskt bra! Branch protection fungerar.
Om du behöver ändra main, gör det via PR från dev.

### Workflow körs inte

**Kontrollera:**

1. ✅ Är workflow-filen i `.github/workflows/`?
2. ✅ Har du gjort commit och push?
3. ✅ Matchar branch-namnet triggers i workflow?
4. ✅ Är det en merge till main (inte bara en push)?

## Checklista för första PR

När ni är redo att göra er första PR till main:

- [ ] Alla features testade lokalt
- [ ] Alla GitHub Secrets lagda in
- [ ] AWS S3 bucket konfigurerad
- [ ] Render service konfigurerad
- [ ] Database setup och kopplad
- [ ] Branch protection rules satta
- [ ] Code review genomförd
- [ ] README uppdaterad med instruktioner
