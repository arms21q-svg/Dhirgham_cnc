# ضرغام CNC | Dargham CNC

موقع احترافي لعرض أعمال وتصاميم CNC على الخشب — مبني بـ Next.js 16 مع دعم العربية والإنجليزية.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + **shadcn/ui**
- **next-intl** — Arabic/English i18n with RTL support
- **@teispace/next-themes** — Dark/Light mode (React 19 compatible)
- **Prisma ORM** + SQLite (ready for PostgreSQL)
- **Google Gemini** — AI assistant and admin content tools

## Pages

| Page | Arabic | English |
|------|--------|---------|
| Home | `/` | `/en` |
| Works | `/works` | `/en/works` |
| About | `/about` | `/en/about` |
| Services | `/services` | `/en/services` |
| Contact | `/contact` | `/en/contact` |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Push database schema and seed
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

Edit `src/config/site.ts` to update:
- Phone number, WhatsApp, email
- Social media links
- Business address
- Site URL

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Localized pages
│   ├── admin/             # Admin dashboard
│   └── api/               # Public and admin API routes
├── components/
│   ├── layout/            # Header, Footer, TopBar, FloatingActions
│   ├── sections/          # Page sections (Hero, Works, etc.)
│   ├── shared/            # Theme toggle, locale switcher
│   └── ui/                # shadcn/ui components
├── config/                # Site configuration
├── data/                  # Static services data and seed defaults
├── i18n/                  # Internationalization setup
├── lib/                   # Utilities, Prisma, auth, AI, metadata
└── messages/              # ar.json & en.json translations
```

## Admin Dashboard

Access the admin panel at `/admin/login`

Default credentials (change after first login):
- **Email:** admin@darghamcnc.com
- **Password:** Admin@123456

### Admin Features
- **Works:** Add, edit, delete projects with optional descriptions
- **FAQ:** Manage published questions and answers
- **Messages & Quotes:** Review contact form and quote requests
- **Site Settings:** Update phone, WhatsApp, email, address, and map URL
- **AI Settings:** Configure Gemini assistant and admin AI tools
- **Admins:** Super admin can add multiple admin accounts

Configure in `.env`:
```
AUTH_SECRET="your-random-secret"
ADMIN_EMAIL="admin@darghamcnc.com"
ADMIN_PASSWORD="your-secure-password"
GEMINI_API_KEY="your-gemini-api-key"
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run db:push` | Sync Prisma schema to DB |
| `npm run db:seed` | Seed default data |
| `npm run db:studio` | Open Prisma Studio |

## License

Private — All rights reserved.
