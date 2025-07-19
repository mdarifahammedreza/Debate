# Community Debate Arena

A full-stack Next.js application for hosting and participating in community debates. Features authentication (Google), argument/voting system, leaderboard, and API documentation.

---

## Features

- Next.js 15 App Router
- PostgreSQL database (via Prisma)
- NextAuth.js authentication (Google)
- Docker & Docker Compose support
- API documentation with Redoc (`/docs`)
- GitHub Actions CI/CD pipeline

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/debate-arena.git
cd debate-arena
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root with the following:

```env
POSTGRES_DB=yourdbname
POSTGRES_USER=yourdbuser
POSTGRES_PASSWORD=yourdbpassword
DATABASE_URL=postgresql://yourdbuser:yourdbpassword@localhost:5432/yourdbname
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Set up the database

```sh
npx prisma migrate dev --name init
```

### 5. Run the app locally

```sh
npm run dev
```

---

## Docker & Docker Compose

### Build and run with Docker Compose

```sh
docker-compose up --build
```

- App: [http://localhost:3000](http://localhost:3000)
- Postgres: port 5432

### Stopping and removing containers

```sh
docker-compose down
```

---

## API Documentation

- Visit [http://localhost:3000/docs](http://localhost:3000/docs) for live API docs (Redoc, OpenAPI spec in `public/openapi.json`).

---

## CI/CD

- GitHub Actions workflow runs on every push and PR to `main`/`master`:
  - Installs dependencies
  - Lints code
  - Runs tests (if present)
  - Builds the app
  - (Optional) Deploys to Vercel/Netlify/other

---

## Project Structure

```
├── src/app
│   ├── api         # API routes (Next.js App Router)
│   ├── components  # React components
│   ├── ClientLayout.jsx
│   └── layout.js   # Root layout
├── prisma          # Prisma schema and migrations
├── public          # Static assets, openapi.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── README.md
```

---

## Environment Variables

- See `.env.example` for all required variables.
- Secrets (Google, NextAuth, DB) should **never** be committed to git.

---

## License

MIT
