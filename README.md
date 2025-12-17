# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

WCWS/
├── astro.config.mjs          # Astro config with Tailwind & Netlify
├── tailwind.config.mjs       # Tailwind with custom colors & animations
├── netlify.toml              # Netlify deployment config
├── package.json              # Dependencies
├── public/
│   ├── logo.svg              # Site logo
│   └── images/news/          # News images folder
└── src/
    ├── layouts/
    │   └── Layout.astro      # Base HTML layout with TypeScript props
    ├── components/
    │   ├── Header.astro      # Navigation with mobile menu
    │   ├── Hero.astro        # Hero section with animations
    │   ├── Stats.astro       # Animated counter stats
    │   ├── NewsSection.astro # News grid cards
    │   ├── About.astro       # Bilingual about section
    │   └── Footer.astro      # Footer with partners
    └── pages/
        ├── index.astro       # Homepage
        ├── news.astro        # News listing page
        ├── showcase.astro    # Podcast episodes page
        └── contact.astro     # Contact form (Netlify Forms)`

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
