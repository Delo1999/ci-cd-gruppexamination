# Backend - Meetup App API

Express.js backend för meetup-applikationen.

## Lokal utveckling

### Förutsättningar

- Node.js 18+
- npm eller yarn

### Installation

```bash
npm install
```

### Kör lokalt

```bash
npm run dev
```

Servern körs på `http://localhost:3000`

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

### Kör Docker container

```bash
docker run -p 3000:3000 --env-file .env meetup-app-backend
```

## API Endpoints

- `GET /health` - Health check
- `GET /` - API info
- `GET /api` - API status

Ytterligare endpoints kommer att läggas till när user stories implementeras.

## Deployment

Backend deployas automatiskt till Render när pull requests mergas till `main` branch.

Deployment sker via:

1. GitHub Actions bygger Docker image
2. Image pushas till Docker Hub
3. Render deployar automatiskt via webhook
