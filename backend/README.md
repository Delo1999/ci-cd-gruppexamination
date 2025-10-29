# Backend - Meetup App API

Express.js backend för meetup-applikationen, byggd med TypeScript.

## Lokal utveckling

### Förutsättningar

- Node.js 18+
- npm eller yarn

### Installation

```bash
npm install
```

### Kör lokalt (development mode med hot reload)

```bash
npm run dev
```

Detta använder `ts-node` och `nodemon` för att köra TypeScript direkt utan att behöva bygga först.

Servern körs på `http://localhost:3000`

### Bygga för produktion

```bash
npm run build
```

Detta kompilerar TypeScript till JavaScript i `dist/` mappen.

### Kör compiled version

```bash
npm start
```

### Miljövariabler

Skapa en `.env` fil i root av backend-mappen:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_connection_string
```

## Docker

### Bygg Docker image lokalt

```bash
docker build -t meetup-app-backend .
```

Dockerfile bygger automatiskt TypeScript och kör den compiled versionen.

### Kör Docker container

```bash
docker run -p 3000:3000 --env-file .env meetup-app-backend
```

## Projektstruktur

```
backend/
├── src/
│   └── server.ts         # Main server file (TypeScript)
├── dist/                  # Compiled JavaScript (genereras vid build)
├── tsconfig.json          # TypeScript konfiguration
├── nodemon.json           # Nodemon konfiguration för dev mode
├── Dockerfile             # Docker build config
└── package.json
```

## TypeScript

Projektet använder TypeScript för bättre type safety och utvecklarupplevelse.

- Source kod ligger i `src/`
- Compiled JavaScript hamnar i `dist/` (ignoreras av git)
- TypeScript config i `tsconfig.json`

## API Endpoints

- `GET /health` - Health check
- `GET /` - API info
- `GET /api` - API status

Ytterligare endpoints kommer att läggas till när user stories implementeras.

## Deployment

Backend deployas automatiskt till Render när pull requests mergas till `main` branch.

Deployment sker via:

1. GitHub Actions bygger Docker image (kompilerar TypeScript)
2. Image pushas till Docker Hub
3. Render deployar automatiskt via webhook
