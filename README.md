# 童心・同享 We Care We Share

A bilingual podcast website for elementary school children, built with Astro and Netlify.

## About

**We Care We Share** is an educational podcast project that helps elementary school students in Taiwan practice English through storytelling. The website showcases podcast episodes, team information, and news updates.

## Project Structure

```
WeCareWeShare/
├── astro.config.mjs          # Astro config with Tailwind & Netlify adapter
├── tailwind.config.mjs       # Tailwind with custom colors & animations
├── netlify.toml              # Netlify deployment config
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
├── .env.example              # Environment variables template
│
├── public/
│   └── favicon.png           # Site favicon
│
├── scripts/
│   └── fetch-episodes.ts     # Spotify API fetcher for podcast episodes
│
└── src/
    ├── assets/               # Images (homepage, icons, news, team)
    │
    ├── components/
    │   ├── Header.astro      # Navigation with mobile menu
    │   ├── Hero.astro        # Hero section with animations
    │   ├── Stats.astro       # Animated counter stats
    │   ├── NewsSection.astro # News grid cards
    │   ├── About.astro       # Bilingual about section
    │   └── Footer.astro      # Footer with partners
    │
    ├── data/
    │   └── episodes.json     # Podcast episodes data (auto-generated)
    │
    ├── layouts/
    │   └── Layout.astro      # Base HTML layout
    │
    ├── pages/
    │   ├── index.astro       # Homepage
    │   ├── podcast.astro     # Podcast episodes with Spotify embeds
    │   ├── team.astro        # Team introduction page
    │   ├── news.astro        # News listing page
    │   ├── contact.astro     # Contact form (Netlify Forms)
    │   └── news/             # Individual news articles
    │       ├── 5-Its-a-wrap-on-the-storytelling-contest.astro
    │       ├── 6-season5-is-here.astro
    │       ├── 7-meet-and-greet-highlights.astro
    │       └── 8-recording-in-action.astro
    │
    └── types/
        └── aos.d.ts          # AOS animation library types
```

## Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run fetch-episodes`  | Fetch latest episodes from Spotify API           |

## Spotify Integration

The podcast page fetches episode data from Spotify API. To update episodes:

1. Copy `.env.example` to `.env`
2. Add your Spotify API credentials:
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```
3. Run `npm run fetch-episodes`

The script will:
- Fetch all episodes from the Spotify show
- Parse season/episode numbers from titles
- Preserve any manually edited data
- Save to `src/data/episodes.json`

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [AOS](https://michalsnik.github.io/aos/)
- **Deployment**: [Netlify](https://netlify.com/)
- **Podcast Data**: Spotify Web API