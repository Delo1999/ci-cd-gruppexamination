# Projektstruktur

## Översikt

```
ci-cd-gruppexamination/
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml    # Frontend → AWS S3 deployment
│       └── deploy-backend.yml     # Backend → Docker Hub → Render
│
├── frontend/                      # React frontend (TypeScript)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.tsx
│   │   ├── index.css
│   │   └── react-app-env.d.ts
│   ├── tsconfig.json              # TypeScript config
│   ├── package.json
│   └── README.md
│
├── backend/                       # Express.js backend (TypeScript)
│   ├── src/
│   │   └── server.ts              # Main server file
│   ├── Dockerfile                 # Docker image definition
│   ├── .dockerignore
│   ├── tsconfig.json              # TypeScript config
│   ├── nodemon.json               # Nodemon config för dev
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── README.md                      # Huvuddokumentation
├── SETUP_GUIDE.md                 # Steg-för-steg setup
├── GIT_FLOW_GUIDE.md              # Git flow instruktioner
├── ARCHITECTURE_DECISIONS.md      # Förklaringar av val och alternativ
└── PROJECT_STRUCTURE.md           # Denna fil
```

## Detaljerad Beskrivning

### `.github/workflows/`

GitHub Actions CI/CD pipelines:

- **deploy-frontend.yml**: Bygger React-app och deployar till S3
- **deploy-backend.yml**: Bygger Docker image, pushar till Docker Hub, triggerar Render

### `frontend/`

React-applikation:

- Standard Create React App struktur
- Build-output går till `build/` (ignoreras av git)
- Deployar automatiskt till S3 vid merge till main

### `backend/`

Express.js API:

- Dockerfile för containerisering
- Deployar automatiskt till Render vid merge till main
- Kör som Docker container i molnet

## Deployment Flow

```
┌─────────────────┐
│  Feature Branch │
│  (utveckling)   │
└────────┬────────┘
         │
         │ PR → Code Review
         ▼
┌─────────────────┐
│   Dev Branch    │
│   (integration) │
└────────┬────────┘
         │
         │ PR → Code Review
         ▼
┌─────────────────┐
│   Main Branch   │
└────────┬────────┘
         │
         ├──────────────────┬──────────────────┐
         ▼                  ▼                  ▼
    GitHub Actions     GitHub Actions     GitHub Actions
         │                  │                  │
         ▼                  ▼                  ▼
    Build React      Build Docker       Push to Docker Hub
         │                  │                  │
         ▼                  ▼                  ▼
    Deploy to S3      Tag Image         Trigger Render
         │                  │                  │
         └──────────────────┴──────────────────┘
                            │
                            ▼
                    Production Live! 🚀
```

## Nästa Steg

När strukturen är på plats:

1. **Implementera User Stories**

   - Skapa feature branches
   - Följ git flow processen

2. **Utöka Backend**

   - Lägg till routes i `server.js` eller skapa `routes/` mapp
   - Lägg till databas-connection (PostgreSQL/MongoDB)
   - Lägg till models/controllers

3. **Utöka Frontend**

   - Skapa komponenter i `src/components/`
   - Skapa pages i `src/pages/`
   - Skapa API services i `src/services/`
   - Lägg till routing med React Router

4. **Testing** (om tid finns)
   - Unit tests
   - Integration tests
   - E2E tests
