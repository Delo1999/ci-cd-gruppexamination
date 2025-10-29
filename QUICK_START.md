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

- [ ] `DOCKER_HUB_USERNAME`
- [ ] `DOCKER_HUB_TOKEN`
- [ ] `RENDER_API_KEY`
- [ ] `RENDER_SERVICE_ID`
- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_S3_BUCKET_NAME`
- [ ] `AWS_REGION`
- [ ] `REACT_APP_API_URL` (valfritt, för production API URL)

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
