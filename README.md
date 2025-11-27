Frontend länk - http://ci-cd-gruppexamination.s3-website.eu-north-1.amazonaws.com/

# CI/CD Gruppexamination - Meetup App

Fullstack-applikation för att se och anmäla sig till meetups.

## Projektstruktur

Detta är ett **monorepo** som innehåller både frontend och backend:

```
ci-cd-gruppexamination/
├── frontend/          # React frontend
├── backend/           # Express.js backend (Docker)
├── .github/
│   └── workflows/     # GitHub Actions CI/CD pipelines
└── README.md
```

## Git Flow

Projektet följer git flow med följande branches:

- **main**: Produktionsbranch. Endast via pull requests från dev.
- **dev**: Utvecklingsbranch. Feature branches mergas här först.
- **feature/**: Feature branches kopplade till user stories.

### Branch Protection Rules

I GitHub repository settings, sätt upp följande:

1. **main branch:**

   - ✅ Require pull request reviews before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow pushing directly to main
   - ✅ Restrict pushes to main (endast från dev via PR)

2. **dev branch:**
   - ✅ Require pull request reviews before merging
   - ✅ Allow force pushes (för flexibilitet under utveckling)

## Deployment

### Frontend (AWS S3)

- Deployar automatiskt till S3 när PR mergas till `main`
- Via GitHub Actions workflow: `.github/workflows/deploy-frontend.yml`

### Backend (Render)

- Byggs som Docker image och pushas till Docker Hub
- Deployar automatiskt till Render när PR mergas till `main`
- Via GitHub Actions workflow: `.github/workflows/deploy-backend.yml`

## Utvecklingsprocess

1. Skapa en feature branch från `dev`: `git checkout -b feature/user-story-name dev`
2. Utveckla och committa dina ändringar
3. Skapa pull request till `dev` för code review
4. Efter merge till `dev`, testa tillsammans
5. När redo för produktion: skapa pull request från `dev` till `main`
6. Efter merge till `main`: automatisk deployment

## Setup

### Första gången (för gruppen)

1. En person lägger in secrets i GitHub:

   - `DOCKER_HUB_USERNAME`
   - `DOCKER_HUB_TOKEN`
   - `RENDER_API_KEY`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET_NAME`
   - `AWS_REGION`

2. Klona repot och sätta upp branches:

```bash
git checkout -b dev
git push -u origin dev
```

### Lokal utveckling

Se README-filer i respektive mapp för instruktioner.

## Teknisk stack

- **Frontend**: React med TypeScript
- **Backend**: Express.js med TypeScript
- **Database**: PostgreSQL (Render) eller MongoDB
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: AWS S3 (frontend), Render (backend)
