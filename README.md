# 童心・同享 We Care We Share

[![Netlify Status](https://api.netlify.com/api/v1/badges/f58faea3-413f-411e-ab31-014f4894a9a7/deploy-status)](https://app.netlify.com/projects/wecareweshare/deploys)

A bilingual podcast website for elementary school children, built with Astro and Netlify.

## About

**[We Care We Share](https://open.spotify.com/show/2r2drOqJuUMAY2ubsHS9E7)** is an educational podcast project that helps elementary school students in Taiwan practice English through storytelling. The website showcases podcast episodes, about team, and latest news.

## Project Structure

```
WeCareWeShare/
├── astro.config.mjs          # Astro config with Tailwind & Netlify adapter
├── tailwind.config.mjs       # Tailwind with custom colors & animations
├── netlify.toml              # Netlify deployment config
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── public/
│   └── favicon.png           # Site favicon
├── scripts/
│   └── fetch-episodes.ts     # Spotify API fetcher for podcast episodes
└── src/
    ├── assets/               # Images (homepage, icons, news, team)
    ├── components/
    │   ├── Header.astro      # Navigation with mobile menu
    │   ├── Hero.astro        # Hero section with animations
    │   ├── Stats.astro       # Animated counter stats
    │   ├── NewsSection.astro # News grid cards
    │   ├── About.astro       # Bilingual about section
    │   └── Footer.astro      # Footer with partners
    ├── data/
    │   └── episodes.json     # Podcast episodes data
    ├── layouts/
    │   └── Layout.astro      # Base HTML layout
    ├── pages/
    │   ├── index.astro       # Homepage
    │   ├── podcast.astro     # Podcast episodes with Spotify embeds
    │   ├── team.astro        # Team introduction
    │   ├── news.astro        # News listing
    │   ├── contact.astro     # Contact form (Netlify Forms)
    │   └── news/             # Individual news articles
    │       ├── ...           # Posts and news articles
    └── types/
        └── aos.d.ts          # AOS animation library types
```

## Deployment

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run fetch-episodes`  | Fetch latest episodes from Spotify API           |

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [AOS](https://michalsnik.github.io/aos/)
- **Deployment**: [Netlify](https://netlify.com/)
- **Podcast Data**: Spotify Web API