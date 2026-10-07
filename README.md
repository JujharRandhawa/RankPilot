# RankPilot — Autonomous SEO Content Engine & Analytics Dashboard

College project software that demonstrates an end-to-end SEO workflow:

1. **Keyword research** (mock SERP expansion)
2. **Autonomous content generation** (AI-style drafts without paid API keys)
3. **SEO scoring** (keyword, structure, readability, meta, length)
4. **Content library** (edit, preview, status)
5. **Analytics dashboard** (simulated organic traffic, rankings, intent mix)

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** for UI
- **Recharts** for analytics charts
- **JSON file store** (`data/store.json`) — no database server required
- **Mock SEO engines** in `src/lib/seo/` (deterministic, viva-friendly)

## Features for viva / demo

| Module | What to show |
| --- | --- |
| Landing | Brand hero → Launch dashboard |
| Dashboard | KPIs, traffic chart, ranking table, content health |
| Keyword Research | Seed keyword → volume, difficulty, CPC, intent, opportunity |
| Content Engine | Generate full markdown draft + meta + outline + score |
| Library | List/edit/delete drafts; save re-scores content |
| SEO Analyzer | Paste any text and score it |
| Analytics | Clicks/impressions, position trend, intent pie, score bars |
| Reset | Analytics page → “Reset demo data” |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo data is created automatically on first API request in `data/store.json`.

```bash
npm run build
npm start
```

## Project structure

```
src/
  app/
    page.tsx                 # Landing
    (app)/                   # Authenticated-style app shell
      dashboard/
      research/
      engine/
      library/
      analyzer/
      analytics/
    api/                     # REST APIs for the engines
  components/                # UI shell, charts helpers, markdown
  lib/
    db.ts                    # Persistence + seed
    seo/
      keywords.ts            # Mock keyword research
      generator.ts           # Content engine
      scorer.ts              # SEO scoring model
data/store.json              # Auto-generated runtime data
```

## Architecture (short)

```
UI (Next.js pages)
    ↓ fetch
API routes (/api/*)
    ↓
SEO engines (research / generate / score)
    ↓
JSON store (project, keywords, contents, analytics, rankings)
```

All “external” SEO signals are **simulated** with seeded hashes so results are stable and reproducible without Google/OpenAI keys.

## Suggested viva talking points

- Why mock APIs? Offline demos, zero cost, reproducible scores for evaluation.
- Scoring weights: keyword 30%, structure 25%, readability 15%, meta 15%, length 15%.
- Content engine maps keyword → outline → meta → body → score in one pipeline.
- Dashboard closes the loop: research → write → measure.

## Author

Built as a complete college software project (demo-ready).
