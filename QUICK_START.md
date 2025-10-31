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
- [ ] `RENDER_API_KEY` - Render API key för deployment
- [ ] `AWS_ACCESS_KEY_ID` - AWS access key
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS secret access key

### 📝 Repository Variables

För icke-känslig konfigurationsdata - gå till **Variables**:

- [ ] `DOCKER_HUB_USERNAME` - Docker Hub användarnamn
- [ ] `RENDER_SERVICE_ID` - Render service ID (hittas i Render dashboard)
- [ ] `AWS_S3_BUCKET_NAME` - Namn på S3 bucket (t.ex. `meetup-app-frontend`)
- [ ] `AWS_REGION` - AWS region (t.ex. `eu-north-1`)
- [ ] `REACT_APP_API_URL` (valfritt) - Production API URL för frontend build

> **Notera:** Secrets är krypterade och visas aldrig i logs. Variables kan ses i workflows men ändras inte ofta. Om ni har flera miljöer (staging/production) kan ni använda **Environment secrets/variables** istället.

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
