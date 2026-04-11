# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`auto-list` (超跑百科 — Supercar Wiki) is a bilingual supercar encyclopedia built with Next.js 14 (App Router) + Supabase (PostgreSQL) + Tailwind CSS, deployed on Vercel.

## Commands

```bash
npm install            # install dependencies
npm run dev            # start dev server (localhost:3000)
npm run build          # production build
npm run lint           # eslint
npm run db:types       # regenerate Supabase TypeScript types
npx tsx scripts/seed.ts  # seed database from JSON files (requires .env.local)
```

## Architecture

- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL) with Row Level Security (public read-only)
- **Hosting:** Vercel (free tier)
- **Theme:** Dark luxury magazine aesthetic (black backgrounds, gold accent #d4a853)

## Key Directories

```
src/app/                    # Next.js App Router pages
src/app/brands/             # Brand listing + [brand]/[car] detail pages
src/app/compare/            # Side-by-side comparison (client component)
src/app/search/             # Full-text search (client component)
src/app/api/og/compare/     # OG image generation (Edge runtime)
src/app/api/healthz/        # Cron endpoint to keep Supabase alive
src/lib/supabase/           # Supabase client (server.ts + client.ts)
supabase/migrations/        # SQL migrations
scripts/seed-data/          # JSON seed files (one per brand)
scripts/seed.ts             # Seed script
```

## Database Schema

Three tables: `brands` → `car_series` → `car_variants` (hierarchical).
`car_variants` has full-text search via `tsvector` column + GIN index.
Generated column: `power_to_weight_hp_per_ton`.
RLS enabled on all tables (public SELECT only).

## Environment Variables

See `.env.local.example`. Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for seed script + healthz)
- `CRON_SECRET` (for healthz endpoint auth)

## Repository

- GitHub: https://github.com/GuanxiongWuEgo/auto-list

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
