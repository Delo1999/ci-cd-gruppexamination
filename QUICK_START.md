# Quick Start Guide

Snabbreferens för att komma igång med projektet.

## 🚀 Snabbstart (10 minuter)

### 1. Initial Setup

```bash
# Klona repo (efter första push)
git clone <your-repo-url>
cd ci-cd-gruppexamination

# Skapa dev branch
git checkout -b dev
git push -u origin dev
```

### 2. Installera Dependencies

**Frontend:**

```bash
cd frontend
npm install
cd ..
```

**Backend:**

```bash
cd backend
npm install
cd ..
```

### 3. Konfigurera Miljövariabler

**Frontend `.env`:**

```env
REACT_APP_API_URL=http://localhost:3000/api
```

**Backend `.env`:**

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_url_here
```

### 4. Kör Lokalt

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Kör på http://localhost:3000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
# Öppnar http://localhost:3000 (React dev server)
```

## 📋 GitHub Secrets Checklist

Lägg in dessa i **Settings > Secrets and variables > Actions**:

### 🔐 Repository Secrets

För känslig data (tokens, keys, credentials) - gå till **Repository secrets**:

- [x] `DOCKER_HUB_TOKEN` - Docker Hub authentication token
- [x] `RENDER_API_KEY` - Render API key för deployment
- [x] `AWS_ACCESS_KEY_ID` - AWS access key
- [x] `AWS_SECRET_ACCESS_KEY` - AWS secret access key

### 📝 Repository Variables

För icke-känslig konfigurationsdata - gå till **Variables**:

- [x] `DOCKER_HUB_USERNAME` - Docker Hub användarnamn
- [x] `RENDER_SERVICE_ID` - Render service ID (hittas i Render dashboard)
- [x] `AWS_S3_BUCKET_NAME` - Namn på S3 bucket (t.ex. `meetup-app-frontend`)
- [x] `AWS_REGION` - AWS region (t.ex. `eu-north-1`)
- [ ] `REACT_APP_API_URL` (valfritt) - Production API URL för frontend build

> **Notera:** Secrets är krypterade och visas aldrig i logs. Variables kan ses i workflows men ändras inte ofta. Om ni har flera miljöer (staging/production) kan ni använda **Environment secrets/variables** istället.

## 🎯 Vad är syftet med Docker och Render?

### Docker - Containerisering av Backend

**Vad är Docker?**

- Docker paketerar din backend-applikation i en "container" med alla dependencies
- Detta säkerställer att appen körs likadant överallt (lokalt, i CI/CD, på Render)
- Tänk på det som en liten "box" med allt som behövs för att köra appen

**Varför används det här?**

1. **Konsistens**: Din backend körs exakt samma sätt lokalt och i produktion
2. **Isolering**: Alla dependencies (Node.js, npm-paket) är inkluderade
3. **Deployment**: Render kan ta din Docker image och köra den direkt
4. **CI/CD**: GitHub Actions bygger Docker image och pushar till Docker Hub, sedan tar Render den

**Process:**

```
Kod → Dockerfile → Docker Image → Docker Hub → Render tar image → Backend körs!
```

### Render - Hosting av Backend

**Vad är Render?**

- Render är en hosting-plattform (liknande Heroku) som kör din backend-applikation
- Den hanterar deployment, health checks, och auto-scaling automatiskt
- Du behöver inte konfigurera servrar själv

**Varför Render?**

1. **Enkel deployment**: Koppla GitHub repo → automatiskt deployment
2. **Docker support**: Kan köra Docker containers direkt
3. **Database integration**: Enkelt att koppla PostgreSQL databas
4. **Auto-scaling**: Render skalar upp/down automatiskt baserat på trafik
5. **Health checks**: Render kontrollerar automatiskt om appen fungerar

**Process:**

```
Render tar Docker image från Docker Hub → Startar container → Backend är live på internet!
```

### AWS S3 - Hosting av Frontend

**Vad är AWS S3?**

- S3 (Simple Storage Service) är ett fil-lagringssystem från Amazon
- Perfekt för statiska filer som din React-app (HTML, CSS, JavaScript)
- Mycket billigt och snabbt för statiska webbplatser

**Varför S3 för frontend?**

1. **Billigt**: Mycket billigare än att köra en server för statiska filer
2. **Snabbt**: Filerna levereras direkt från AWS CDN
3. **Skalbar**: Hanterar miljontals requests utan problem
4. **Enkelt**: Bara ladda upp filerna och de är live

**Process:**

```
React kod → npm run build → Skapar statiska filer → GitHub Actions → AWS S3 → Frontend är live!
```

## 🔑 Steg-för-steg: Hämta Render Nycklar

### Steg 1: Hämta Render API Key

1. Gå till [render.com](https://render.com) och logga in
2. Klicka på ditt **användarnamn** (övre högra hörnet) > **Account Settings**
3. Scrolla ner till **API Keys**-sektionen
4. Klicka på **Create API Key**
5. Ge den ett namn (t.ex. "GitHub Actions")
6. Klicka **Create Key**
7. **Kopiera nyckeln direkt** (du kan bara se den en gång!)
8. Lägg in den i GitHub som **Repository Secret** med namnet `RENDER_API_KEY`

### Steg 2: Skapa Render Web Service

Du behöver skapa en Web Service på Render för att kunna hämta Service ID:

1. Gå till [Render Dashboard](https://dashboard.render.com)
2. Klicka **New +** > **Web Service**
3. Connect din GitHub repository:
   - Klicka **Connect GitHub**
   - Välj ditt repository
   - Klicka **Connect**
4. Konfigurera Web Service:
   - **Name**: `meetup-app-backend` (eller valfritt namn)
   - **Environment**: Välj **Docker**
   - **Root Directory**: `backend` (⚠️ VIKTIGT! Detta sätter build context till backend-mappen)
   - **Dockerfile Path**: `Dockerfile` (eller `./Dockerfile` - relativa till Root Directory)
   - **Branch**: `main`
   - **Auto-Deploy**: **Yes**
5. Scrolla ner till **Environment Variables** och lägg till:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render tilldelar port automatiskt, men detta är standard)
   - `DATABASE_URL` = Kopiera **Internal Database URL** från din PostgreSQL databas (från Render Dashboard > din databas > Connection info)
6. Klicka **Create Web Service**
7. Render kommer börja bygga din service (det kan ta några minuter)

> **Om du redan har skapat din service:** Gå till din service → **Settings** → scrolla ner till **Build**-sektionen → ändra **Root Directory** till `backend` och **Dockerfile Path** till `Dockerfile` → **Save Changes** → starta en ny build.

### Steg 3: Hämta Render Service ID

1. När din Web Service är skapad, gå till din service i Render Dashboard
2. Klicka på din service (`meetup-app-backend`)
3. Titta i adressfältet - URL:en ser ut så här:
   ```
   https://dashboard.render.com/web/YOUR_SERVICE_ID
   ```
4. **Service ID** är den långa alfanumeriska strängen efter `/web/`
   - T.ex. om URL:en är `https://dashboard.render.com/web/srv-abc123xyz456`
   - Då är `srv-abc123xyz456` ditt Service ID
5. Alternativt: Gå till **Settings** i din service och scrolla ner till **Info** - Service ID finns där också
6. Lägg in Service ID i GitHub som **Repository Variable** med namnet `RENDER_SERVICE_ID`

### Steg 4: Koppla Database till Web Service

1. Gå till din PostgreSQL databas i Render Dashboard
2. Kopiera **Internal Database URL** (inte External - Internal är vad som används i Render)
3. Gå till din Web Service > **Environment**
4. Lägg till environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Klistra in din Internal Database URL
5. Klicka **Save Changes**

> **Tips:** Om du har redan skapat din databas, kan du också koppla den direkt från databas-sidan genom att klicka på **Connect** och välja din Web Service.

## ☁️ Steg-för-steg: Sätt upp AWS för Frontend Deployment

AWS credentials behövs för att GitHub Actions ska kunna ladda upp din React-app till AWS S3 (där frontend hostas).

### Varför behövs AWS credentials?

**AWS_ACCESS_KEY_ID** och **AWS_SECRET_ACCESS_KEY** är som ditt "användarnamn och lösenord" för att logga in på AWS från GitHub Actions. De används för att:

1. **Authentisera** GitHub Actions till AWS
2. **Ladda upp** de byggda React-filerna till S3 bucket
3. **Hantera** filer i S3 (uppdatera, ta bort gamla filer, etc.)

### Steg 1: Skapa AWS-konto (om du inte har ett)

1. Gå till [aws.amazon.com](https://aws.amazon.com)
2. Klicka **Create an AWS Account**
3. Följ instruktionerna för att skapa ett konto
4. Du behöver ett kreditkort men AWS Free Tier ger generöst gratis utrymme

### Steg 2: Skapa IAM User och Access Keys

1. Logga in på [AWS Console](https://console.aws.amazon.com)
2. Sök efter **IAM** (Identity and Access Management) i sökfältet
3. Klicka på **IAM** i resultaten
4. I vänstermenyn, klicka på **Users** > **Create user**
5. Ange ett namn (t.ex. `github-actions-deploy`)
6. Under **Select AWS credential type**, välj:
   - ✅ **Access key - Programmatic access** (måste vara vald)
   - ❌ **Password - AWS Management Console access** (avmarkerad/unchecked - behövs INTE för GitHub Actions)
7. Klicka **Next**
8. Under **Set permissions**, välj **Attach policies directly**
9. Sök efter och kryssa i **AmazonS3FullAccess** (eller skapa en mer begränsad policy om du vill)
10. Klicka **Next** > **Create user**
11. Klicka på den nyskapade användaren
12. Gå till **Security credentials**-fliken
13. Scrolla ner till **Access keys**-sektionen
14. Klicka **Create access key**
15. Välj **Third-party service** som use case
    - GitHub Actions är en tredjepartstjänst (inte AWS) som behöver komma åt dina AWS-resurser
    - Detta är det mest korrekta valet för CI/CD från GitHub
    - (Alternativt kan du välja "Application running outside AWS" om "Third-party service" inte finns)
16. Klicka **Next** > **Create access key**
17. **VIKTIGT**: Kopiera både:
    - **Access key ID** (lägg in som `AWS_ACCESS_KEY_ID` i GitHub)
    - **Secret access key** (lägg in som `AWS_SECRET_ACCESS_KEY` i GitHub)
    - ⚠️ Du kan bara se Secret access key EN gång! Kopiera den direkt.
18. Klicka **Done**

### Steg 3: Skapa S3 Bucket för Frontend

1. I AWS Console, sök efter **S3** och klicka på det
2. Klicka **Create bucket**
3. Ange bucket namn (t.ex. `meetup-app-frontend` - måste vara globalt unikt)
4. Välj **Region** (t.ex. `eu-north-1` för Stockholm, eller närmaste)
5. Scrolla ner och **avmarkera** "Block all public access" (vi behöver att frontend är publik)
6. Kryssa i "I acknowledge that..." för att bekräfta
7. Scrolla ner till **Static website hosting** och klicka **Edit**
   - ✅ **Enable** static website hosting
   - **Index document**: `index.html`
   - **Error document**: `index.html` (för React Router)
   - Klicka **Save changes**
8. Klicka **Create bucket**
9. Klicka på din nya bucket
10. Gå till **Permissions**-fliken > **Bucket policy**
11. Klicka **Edit** och lägg till denna policy (ersätt `YOUR_BUCKET_NAME` med ditt bucket-namn):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

12. Klicka **Save changes**

### Steg 4: Lägg in AWS Credentials i GitHub

1. Gå till ditt GitHub repository > **Settings** > **Secrets and variables** > **Actions**
2. Klicka **New repository secret**
3. Namn: `AWS_ACCESS_KEY_ID`, värde: din Access Key ID från steg 2
4. Klicka **Add secret**
5. Klicka **New repository secret** igen
6. Namn: `AWS_SECRET_ACCESS_KEY`, värde: din Secret Access Key från steg 2
7. Klicka **Add secret**
8. Gå till **Variables**-fliken
9. Klicka **New repository variable**
10. Namn: `AWS_S3_BUCKET_NAME`, värde: ditt bucket-namn (t.ex. `meetup-app-frontend`)
11. Klicka **Add variable**
12. Klicka **New repository variable** igen
13. Namn: `AWS_REGION`, värde: din region (t.ex. `eu-north-1`)
14. Klicka **Add variable**

### Steg 5: Hitta din S3 Website URL

1. Gå till din S3 bucket i AWS Console
2. Klicka på **Properties**-fliken
3. Scrolla ner till **Static website hosting**
4. Du ser **Bucket website endpoint** - detta är din frontend URL!
   - Format: `http://YOUR_BUCKET_NAME.s3-website-REGION.amazonaws.com`
   - T.ex. `http://meetup-app-frontend.s3-website-eu-north-1.amazonaws.com`

> **Tips:** För produktion kan du använda CloudFront (AWS CDN) för bättre prestanda och HTTPS, men S3 direkt fungerar bra för utveckling/test.

## 🔧 Branch Protection Setup

1. Gå till **Settings > Branches**
2. Lägg till rule för `main`:
   - ✅ Require pull request
   - ✅ Require approvals: 1
   - ✅ Block direct pushes
3. (Valfritt) Lägg till rule för `dev`

## 🏗️ AWS S3 Setup

```bash
# Via AWS CLI (eller via Console)
aws s3 mb s3://meetup-app-frontend --region eu-north-1
aws s3 website s3://meetup-app-frontend \
  --index-document index.html \
  --error-document index.html
```

Glöm inte att:

- ✅ Block public access: OFF
- ✅ Add bucket policy för public read
- ✅ Enable static website hosting

## 🐳 Docker Test (Lokalt)

```bash
# Bygg image
cd backend
docker build -t meetup-app-backend .

# Kör container
docker run -p 3000:3000 \
  -e NODE_ENV=development \
  -e PORT=3000 \
  meetup-app-backend
```

## 🔄 Typisk Workflow

```bash
# 1. Skapa feature branch
git checkout dev
git pull
git checkout -b feature/my-feature

# 2. Arbeta och committa
git add .
git commit -m "feat: min nya feature"
git push -u origin feature/my-feature

# 3. Skapa PR på GitHub till dev
# ... code review ...
# ... merge ...

# 4. När redo för produktion: PR från dev till main
# ... merge till main triggerar deployment ...
```

## 🐛 Troubleshooting

### Workflow körs inte

- ✅ Kontrollera att filen är i `.github/workflows/`
- ✅ Kontrollera branch protection rules
- ✅ Se Actions tab för felmeddelanden

### Docker build misslyckas

- ✅ Kontrollera Dockerfile path
- ✅ Kontrollera att allt är committed
- ✅ Testa lokalt först: `docker build -t test ./backend`

### S3 deployment misslyckas

- ✅ Kontrollera AWS credentials
- ✅ Kontrollera bucket namn (exakt matchning)
- ✅ Kontrollera bucket permissions

### Render deployment misslyckas

- ✅ Kontrollera RENDER_SERVICE_ID (hittas i Render dashboard)
- ✅ Kontrollera att Dockerfile finns i backend/
- ✅ Kontrollera att Render service är konfigurerad för Docker

## 📚 Mer Information

- Detaljerad setup: `SETUP_GUIDE.md`
- Git flow: `GIT_FLOW_GUIDE.md`
- Architecture: `ARCHITECTURE_DECISIONS.md`
- Struktur: `PROJECT_STRUCTURE.md`
