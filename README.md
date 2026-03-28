# NLN

Stealth-themed Next.js App Router starter using TypeScript and Tailwind CSS.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- lucide-react (icons)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - Run in development mode
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Routes

- `/` - Home page
- `/onboarding` - Placeholder onboarding page
- `/board` - Placeholder board page

## Quick Exit

The app includes a global `QuickExit` action in `app/layout.tsx`:

- Floating red button at the bottom-right of the screen
- `Esc` key support for rapid redirect
- Redirects to a safe external site (`Google` or `BBC`)

## Folder Structure

```text
app/                  # App Router routes, layout, and global styles
components/
  shared/             # Reusable global UI components
  features/           # Logic-heavy or feature-scoped components
lib/                  # Database and AI utilities/services
```

## Theme Notes

This project ships with a calming stealth palette:

- Deep teals for primary accents
- Slate grays for background surfaces
- Soft muted text contrast for readability