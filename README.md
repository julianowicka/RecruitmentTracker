# 📋 Recruitment Tracker

Aplikacja full-stack do zarządzania aplikacjami o pracę - śledź firmy, statusy, notatki i terminy rozmów w jednym miejscu.

## 🎯 Cel Projektu

Recruitment Tracker pomaga użytkownikom śledzić aplikacje o pracę: firmy, stanowiska, statusy, notatki, terminy rozmów i zadania. Aplikacja pokazuje użycie nowoczesnego reacta.

## 🚀 Stack Technologiczny

- **TanStack Start** - Full-stack React framework (routing + data fetching + backend endpoints)
- **TanStack Query** - Server state management (cache, invalidacje, optimistic updates)
- **TanStack Router** - Typowane trasy i search params
- **Zod** - Walidacja danych (formularze + API)
- **Zustand** - UI state management (modale, filtry lokalne)
- **Drizzle ORM** - Type-safe database queries i migracje
- **SQLite** - Baza danych (via better-sqlite3)
- **TypeScript** - Type safety w całej aplikacji

## 📦 Instalacja i Uruchomienie

### Wymagania
- Node.js 18+ 
- npm lub yarn

### Kroki

1. **Zainstaluj zależności:**
```bash
npm install
```

2. **Skonfiguruj bazę danych (migracje + seed):**
```bash
npm run db:setup
```

3. **Uruchom dev server:**
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 📜 Dostępne Skrypty

- `npm run dev` - Uruchomienie dev servera (port 3000)
- `npm run build` - Build produkcyjny
- `npm run preview` - Podgląd buildu produkcyjnego
- `npm run db:generate` - Wygeneruj migracje Drizzle
- `npm run db:migrate` - Wykonaj migracje
- `npm run db:seed` - Wypełnij bazę przykładowymi danymi
- `npm run db:setup` - Wykonaj migracje + seed (setup od zera)
- `npm run db:studio` - Otwórz Drizzle Studio (GUI dla bazy)

## 🗂️ Struktura Projektu

```
src/
├── db/                  # Warstwa bazy danych
│   ├── schema.ts       # Schemat Drizzle (tabele + typy)
│   ├── index.ts        # Połączenie z bazą
│   ├── migrate.ts      # Skrypt migracji
│   └── seed.ts         # Dane seedowe
├── lib/                # Utilities i helpers
│   ├── constants.ts    # Stałe (statusy, kolory)
│   └── validations.ts  # Schematy Zod
├── stores/             # Zustand stores
│   └── ui-store.ts     # UI state (modale, filtry)
├── routes/             # TanStack Router pages
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Landing page
│   ├── dashboard.tsx   # Dashboard (TODO)
│   └── applications.tsx # Lista aplikacji (TODO)
└── components/         # React components
    └── Header.tsx      # Nawigacja
```

## 📊 Model Danych (Drizzle Schema)

### Tabela `applications`
- Główne aplikacje o pracę
- Pola: company, role, status, link, salaryMin, salaryMax, timestamps

### Tabela `notes`
- Notatki przypisane do aplikacji
- Relacja: applicationId → applications.id (cascade delete)

### Tabela `status_history`
- Historia zmian statusów
- Rejestruje każdą zmianę statusu aplikacji



## 🧠 Kluczowe Decyzje Architektoniczne

1. **Podział State:**
   - Server state → TanStack Query (aplikacje, notatki)
   - UI state → Zustand (modale, lokalne preferencje)

2. **Walidacja:**
   - Zod jako single source of truth
   - Walidacja w formularzach + API endpoints
   - Type safety dzięki `z.infer<>`

3. **Baza Danych:**
   - SQLite dla prostoty (zero konfiguracji)
   - Drizzle dla type-safe queries
   - Migracje w kodzie (version control)

4. **Routing:**
   - File-based routing (TanStack Router)
   - Search params dla filtrów (shareable URLs)

## 📚 Czego się ucze:

- Projektowanie query keys w TanStack Query
- Strategia invalidacji cache
- Walidacja kontraktów API z Zod
- Modelowanie danych i migracje w Drizzle
- Rozdzielenie server vs UI state
- Full-stack development w jednym repozytorium


