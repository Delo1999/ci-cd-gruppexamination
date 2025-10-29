# Architecture Decisions & Alternativ

## 1. Monorepo vs Separata Repon

### ✅ Val: Monorepo

- ✅ Enklare att hantera - en code review, en deployment pipeline setup
- ✅ Enklare att synka versioner mellan frontend och backend
- ✅ Alla har samma kontext för hela projektet
- ✅ Enklare att sätta upp GitHub Actions (mindre repetitivt)

**Alternativ: Separata Repon**

**Fördelar:**

- ✅ Separation of concerns - backend och frontend är helt separata
- ✅ Fristående deployments och versionering
- ✅ Olika teams kan jobba mer isolerat

**Nackdelar:**

- ❌ Mer komplext att sätta upp (två GitHub Actions setups)
- ❌ Måste synka changes mellan repon manuellt
- ❌ Mer overhead för ett mindre projekt

**Rekommendation**: För denna gruppexamination är monorepo bäst. I ett stort projekt skulle separata repon kunna vara bättre.

## 2. Deployment Strategi

### Frontend: AWS S3 + (valfritt) CloudFront

**Varför:**

- ✅ Enkelt och billigt för statiska filer
- ✅ Bra integration med GitHub Actions
- ✅ Snabb och skalbar

**Alternativ:**

- **Vercel/Netlify**: Enklare setup men kravet är S3
- **GitHub Pages**: Gratis men mindre flexibelt
- **CloudFront**: Lägg till för cache och global distribution (rekommenderat för produktion)

### Backend: Render Docker Container

**Varför:**

- ✅ Kravet är Docker + Render
- ✅ Render hanterar auto-scaling och health checks
- ✅ Enkelt att integrera med Docker Hub

**Alternativ:**

- **Heroku**: Liknande men Render är kravet
- **AWS ECS/EC2**: Mer flexibelt men komplext
- **DigitalOcean App Platform**: Alternativ men inte kravet

## 3. CI/CD Pipeline Design

### ✅ Val: Path-based Triggers

Workflows körs bara när relevanta filer ändras:

```yaml
paths:
  - "frontend/**"
```

**Varför:**

- ✅ Sparar CI/CD minuter (viktigt för GitHub Actions free tier)
- ✅ Tydligt vad som triggerar vad
- ✅ Snabbare feedback

**Alternativ: Always Run:**

- Kör workflow på alla PRs oavsett vad som ändrats
- Enklare men slösar resources

### ✅ Val: Merge-based Deployment

Deployar bara när PR mergas till main:

```yaml
if: github.event_name == 'push' || (github.event.pull_request.merged == true)
```

**Varför:**

- ✅ Endast tested code deployas
- ✅ Undviker deployment vid PR-öppning/uppdatering
- ✅ Säkerhet och stabilitet

**Alternativ: Deploy on every push:**

- Deployar även på feature branches
- Användbart för preview environments men inte nödvändigt här

## 4. Docker Strategy

### ✅ Val: Multi-stage Build

```dockerfile
FROM node:20-alpine AS deps
FROM node:20-alpine AS runner
```

**Varför:**

- ✅ Mindre final image size (endast production dependencies)
- ✅ Bättre säkerhet (separerat build- och runtime-miljö)
- ✅ Snabbare deployments

**Alternativ: Single-stage:**

```dockerfile
FROM node:20-alpine
# Allt i ett
```

- Enklare men större image och sämre säkerhet

### ✅ Val: Non-root User

```dockerfile
USER nodejs
```

**Varför:**

- ✅ Bättre säkerhet (containern kör inte som root)
- ✅ Best practice i produktion

## 5. Database Choice

### PostgreSQL (Render) vs MongoDB

**PostgreSQL (Rekommenderat för detta projekt):**

- ✅ Relational - bra för strukturerad data (meetups, anmälningar)
- ✅ SQL - välbekant för många
- ✅ Gratis med Render
- ✅ ACID-transaktioner

**MongoDB (Alternativ):**

- ✅ Flexibel schema - bra för snabb prototypning
- ✅ NoSQL - olika datamodell
- ✅ Måste hostas separat (MongoDB Atlas)

**Rekommendation**: PostgreSQL för meetup-app (strukturerad data med relationer).

## 6. Environment Variables Management

### ✅ Val: GitHub Secrets

**Varför:**

- ✅ Säker lagring av secrets
- ✅ Enkelt att hantera per repository
- ✅ Integrerat med GitHub Actions

**Alternativ:**

- **External secret managers** (AWS Secrets Manager, etc.)
- Mer komplext för detta projekt
- Överengineering för denna uppgift

## 7. React Build Configuration

### ✅ Val: react-scripts (Create React App)

**Varför:**

- ✅ Minimal setup
- ✅ Allt konfigurerat ut-of-the-box
- ✅ Bra för att fokusera på funktionalitet

**Alternativ:**

- **Vite**: Snabbare builds men kräver mer konfiguration
- **Next.js**: SSR/SSG men inte nödvändigt för denna app
- **Custom webpack**: Full kontroll men mycket konfiguration

## 8. API Structure

### ✅ Val: Express.js REST API

**Varför:**

- ✅ Kravet
- ✅ Välbekant för de flesta
- ✅ Bra för CRUD-operationer

**Alternativ:**

- **GraphQL**: Mer flexibel men mer komplex
- **Fastify**: Snabbare än Express men kravet är Express
- **Serverless (AWS Lambda)**: Skalbar men annan deployment-strategi

## Framtida Förbättringar (om tid finns)

1. **Testing Pipeline**:

   - Lägg till jest/cypress i CI/CD
   - Blockera merge om tests failar

2. **Staging Environment**:

   - Deploy dev-branch till staging
   - Testa innan production deploy

3. **Monitoring**:

   - Sentry för error tracking
   - CloudWatch/Analytics för performance

4. **Automated Testing**:

   - Unit tests i både frontend och backend
   - Integration tests för API

5. **Database Migrations**:
   - Knex.js eller Sequelize för migrations
   - Automatiserad migration vid deployment
