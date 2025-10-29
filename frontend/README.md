# Frontend - Meetup App

React frontend för meetup-applikationen.

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
npm start
```

Applikationen öppnas på `http://localhost:3000`

### Miljövariabler

Skapa en `.env` fil i root av frontend-mappen:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

**Viktigt**: Variabler måste börja med `REACT_APP_` för att React ska inkludera dem i bygget.

## Bygga för produktion

```bash
npm run build
```

Detta skapar en `build/` mapp med optimerad produktion-build.

## Deployment

Frontend deployas automatiskt till AWS S3 när pull requests mergas till `main` branch.

Deployment sker via GitHub Actions workflow som:

1. Bygger React-appen
2. Synkar `build/` mappen till S3 bucket
3. (Valfritt) Invaliderar CloudFront cache

## Projektstruktur

```
frontend/
├── public/           # Statiska filer
├── src/              # React komponenter och kod
│   ├── components/   # Reusable komponenter
│   ├── pages/        # Sid-komponenter
│   ├── services/     # API calls
│   ├── App.js        # Main app component
│   └── index.js      # Entry point
└── package.json
```

Ytterligare struktur kommer att byggas ut när user stories implementeras.
