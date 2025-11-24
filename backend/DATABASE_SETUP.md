# Database Setup Guide

Denna guide visar hur du kopplar Render PostgreSQL-databasen till backend-applikationen.

## Steg 1: Skapa PostgreSQL-databas på Render

1. Gå till [Render Dashboard](https://dashboard.render.com)
2. Klicka på **New** > **PostgreSQL**
3. Fyll i:
   - **Name**: `meetup-app-db` (eller valfritt namn)
   - **Database**: `meetup_app` (eller valfritt)
   - **User**: Lämna default eller välj eget
   - **Region**: Välj närmaste region (t.ex. Frankfurt)
   - **Plan**: Välj Free tier
4. Klicka **Create Database**

## Steg 2: Kopiera Database URL

1. I Render Dashboard, klicka på din PostgreSQL-databas
2. Gå till **Connection Info**
3. Kopiera **Internal Database URL** (inte External URL - Internal används inom Render)
   - Den ser ut så här: `postgresql://user:password@hostname:5432/dbname`

## Steg 3: Konfigurera Environment Variables

### Lokal utveckling (`.env` fil)

Skapa en `.env` fil i `backend/` mappen:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/meetup_app
```

**För lokal utveckling:** Om du kör PostgreSQL lokalt, använd din lokala connection string. Om du vill använda Render-databasen lokalt, kopiera **External Database URL** istället.

### Render Web Service

1. Gå till din Render Web Service
2. Klicka på **Environment** tab
3. Lägg till environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Klistra in din **Internal Database URL** från Steg 2
4. Lägg också till:
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Key**: `PORT`
   - **Value**: `10000` (eller vad Render specificerar)

## Steg 4: Testa Anslutningen

När servern startar kommer den automatiskt:

1. ✅ Ansluta till databasen
2. ✅ Skapa `users` tabellen om den inte finns
3. ✅ Logga om anslutningen lyckades

**Förväntad output vid start:**

```
✅ Connected to PostgreSQL database
✅ Database initialized - users table ready
Server running on port 3000
Environment: development
```

## Databas Schema

Tabellen `users` skapas automatiskt med följande struktur:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### "DATABASE_URL is not set!"

- Kontrollera att `.env` filen finns i `backend/` mappen
- Kontrollera att `DATABASE_URL` är satt korrekt i Render Environment Variables

### "Connection timeout"

- För lokal utveckling: Kontrollera att du använder **External Database URL** (inte Internal)
- För Render deployment: Kontrollera att du använder **Internal Database URL**
- Kontrollera att databasen är igång i Render Dashboard

### "Table does not exist"

- Tabellen skapas automatiskt vid första start
- Kontrollera server-loggar för eventuella fel
- Manuellt: Du kan köra SQL direkt i Render Database > Shell

## Säkerhetsanteckningar

⚠️ **VIKTIGT för produktion:**

- Lösenord ska hashas med bcrypt innan de sparas i databasen
- Använd HTTPS i produktion
- Hantera secrets säkert (aldrig commit till git)

För närvarande sparas lösenord som plaintext (endast för utveckling).
