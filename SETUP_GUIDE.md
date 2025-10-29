# Setup Guide - Steg för Steg

## Varför Monorepo?

**Fördelar:**

- ✅ Enklare att hantera versionering tillsammans
- ✅ En enda code review process
- ✅ Enklare att synka frontend och backend changes
- ✅ Enklare att sätta upp CI/CD pipelines

**Alternativ: Separata Repon**
Om ni väljer separata repon behöver ni:

- Två separata GitHub Actions workflows per repo
- Separata secrets per repo
- Mer komplex orchestration mellan deployments

**Rekommendation**: Börja med monorepo, dela upp senare om det behövs.

## Steg 1: Skapa GitHub Repository

1. Skapa ett nytt repository på GitHub
2. Initialisera lokalt och pusha till GitHub:

```bash
git init
git remote add origin <your-repo-url>
git add .
git commit -m "Initial commit: monorepo structure"
git branch -M main
git push -u origin main
```

## Steg 2: Skapa Dev Branch och Branch Protection

```bash
git checkout -b dev
git push -u origin dev
```

### Sätt upp Branch Protection i GitHub:

1. Gå till **Settings** > **Branches**
2. Klicka **Add branch protection rule**

**För main branch:**

- Branch name pattern: `main`
- ✅ Require a pull request before merging
  - ✅ Require approvals: 1
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (om ni har det)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings
- Restrict who can push to matching branches (sätt till admin eller ingen)

**För dev branch (valfritt men rekommenderat):**

- Branch name pattern: `dev`
- ✅ Require a pull request before merging
- ✅ Require approvals: 1
- Tillåt force push om ni behöver det under utveckling

## Steg 3: Lägg in GitHub Secrets

Gå till **Settings** > **Secrets and variables** > **Actions** > **New repository secret**

Lägg in följande secrets (en person i gruppen gör detta):

| Secret Name             | Beskrivning                     | Var hittar du det?                                          |
| ----------------------- | ------------------------------- | ----------------------------------------------------------- |
| `DOCKER_HUB_USERNAME`   | Ditt Docker Hub användarnamn    | docker.com                                                  |
| `DOCKER_HUB_TOKEN`      | Docker Hub access token         | docker.com > Account Settings > Security > New Access Token |
| `RENDER_API_KEY`        | Render API nyckel               | render.com > Account Settings > API Keys                    |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key ID               | AWS IAM Console                                             |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key           | AWS IAM Console                                             |
| `AWS_S3_BUCKET_NAME`    | Namn på din S3 bucket           | AWS S3 Console (skapa först)                                |
| `AWS_REGION`            | AWS region (t.ex. `eu-north-1`) | Välj närmaste region                                        |

## Steg 4: Skapa AWS S3 Bucket för Frontend

1. Gå till AWS S3 Console
2. Klicka **Create bucket**
3. Namn: `meetup-app-frontend` (eller valfritt, måste vara unikt globalt)
4. Region: Välj närmaste (t.ex. `eu-north-1`)
5. Block Public Access: **Avmarkera** "Block all public access" (för att frontend ska vara tillgänglig)
6. ✅ Acknowledge och skapa
7. Gå till **Properties** > **Static website hosting**
   - ✅ Enable static website hosting
   - Index document: `index.html`
   - Error document: `index.html` (för React Router)
8. Gå till **Permissions** > **Bucket Policy** och lägg till:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::meetup-app-frontend/*"
    }
  ]
}
```

## Steg 5: Skapa Render Web Service

1. Gå till Render Dashboard
2. Klicka **New** > **Web Service**
3. Connect GitHub repository
4. Namn: `meetup-app-backend`
5. Environment: **Docker**
6. Dockerfile path: `./backend/Dockerfile`
7. Välj branch: `main`
8. Auto-deploy: **Yes**
9. Environment Variables (lägg till senare när ni har databas):
   - `NODE_ENV=production`
   - `PORT=10000` (eller vad Render specificerar)
   - Databas connection string

## Steg 6: Skapa Database (PostgreSQL eller MongoDB)

### PostgreSQL (Render):

1. Render Dashboard > **New** > **PostgreSQL**
2. Namn: `meetup-app-db`
3. Klicka på din databas och kopiera **Internal Database URL**
4. Lägg till som environment variable i din Render Web Service:
   - `DATABASE_URL` = din kopierade URL

### MongoDB (Alternativ):

- Använd MongoDB Atlas (mongodb.com)
- Skapa cluster och få connection string
- Lägg till som environment variable: `MONGODB_URI`

## Steg 7: Testa Workflow

1. Skapa en feature branch:

```bash
git checkout dev
git checkout -b feature/test-deployment
```

2. Gör en liten ändring (t.ex. lägg till en fil)

3. Commita och pusha:

```bash
git add .
git commit -m "test: verify workflow"
git push -u origin feature/test-deployment
```

4. Skapa pull request till `dev` på GitHub
5. Efter merge till `dev`, skapa pull request från `dev` till `main`
6. Efter merge till `main` borde workflows köras

## Checklista

- [ ] Repository skapat på GitHub
- [ ] Monorepo struktur pushad
- [ ] `dev` branch skapad och pushad
- [ ] Branch protection rules satt upp för `main`
- [ ] GitHub Secrets lagda in
- [ ] AWS S3 bucket skapad och konfigurerad
- [ ] Render Web Service skapad
- [ ] Database skapad och kopplad
- [ ] Testa en hel deployment-cykel
