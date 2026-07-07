# Narrate — News Aggregator & AI Summarizer

**The fastest way to understand today's news.**

Narrate is a production-ready Vite + React web application that aggregates news from multiple sources and uses AI-powered summaries to help you understand articles in seconds. Browse, search, bookmark, and get intelligent insights from any article.

## ✨ Features

- **🔍 Smart News Aggregation**: Browse news from hundreds of sources across multiple categories
- **🤖 AI-Powered Summaries**: Get instant, comprehensive summaries with Groq
- **📚 Search & Filters**: Powerful search with country, language, and category filters
- **🔖 Bookmarks & Folders**: Organize articles into custom folders
- **📖 Reading History**: Track all articles you've read and summaries generated
- **🌙 Dark/Light Theme**: Seamless theme switching with persistent preferences
- **⌨️ Keyboard Shortcuts**: `/` search, `Cmd+K` search modal, `B` bookmark, `S` summarize, `Esc` close
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Lightning Fast**: Optimized with caching, lazy loading, and streaming responses
- **🔒 Privacy First**: All data stored locally in browser localStorage—no server tracking
- **💾 Persistent Storage**: Bookmarks, summaries, history, and preferences saved locally

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Vite + React 19 with TypeScript, client-side routing via [wouter](https://github.com/molefrog/wouter)
- **Backend**: Express (serves the built static assets in production)
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **News API**: GNews (free tier)
- **AI**: Groq (OpenAI-compatible)
- **Storage**: Browser localStorage with repository pattern

### Folder Structure

```
narrate/
├── client/
│   ├── index.html                      # Vite entry HTML
│   └── src/
│       ├── pages/                      # Route-level page components
│       │   ├── Landing.tsx             # Public landing page
│       │   ├── Home.tsx                # News feed
│       │   └── NotFound.tsx
│       ├── components/
│       │   ├── ui/                     # shadcn/ui components
│       │   ├── layout/                 # Navbar, Sidebar
│       │   ├── shared/                 # Typography, EmptyState, etc.
│       │   ├── ArticleCard.tsx
│       │   ├── CategoryTabs.tsx
│       │   ├── SkeletonCard.tsx
│       │   ├── SummaryPanel.tsx
│       │   └── StreamingText.tsx
│       ├── lib/
│       │   ├── storage/                # localStorage repositories
│       │   │   ├── CacheRepository.ts
│       │   │   ├── BookmarksRepository.ts
│       │   │   ├── SummaryRepository.ts
│       │   │   └── PreferencesRepository.ts
│       │   ├── api/                    # API clients (e.g. groq.ts)
│       │   ├── hooks/                  # Custom React hooks
│       │   └── constants/              # Constants
│       ├── contexts/                   # React contexts
│       ├── hooks/                      # Additional shared hooks
│       ├── App.tsx                     # Router (wouter)
│       └── main.tsx                    # Entry point
├── server/
│   └── index.ts                        # Express server (serves dist/public)
├── shared/
│   └── const.ts                        # Constants shared client/server
├── .env.example                        # Environment variables template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Data Flow

News fetching and AI summarization are proxied through the Express server (`server/app.ts`, routes `GET /api/news` and `POST /api/summarize`) so the GNews and Groq keys stay server-side and are never bundled into the browser. In development, the same Express app is mounted as Vite dev-server middleware (see `vitePluginApiRoutes` in `vite.config.ts`), so `pnpm dev` alone is enough — no separate API process needed.

```
User Interface (React Components)
    ↓
Custom Hooks (useBookmarks, useSummary, etc.)
    ↓
Repository Layer (StorageService)
    ↓
Browser localStorage
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (with pnpm)
- GNews API key (free tier): https://gnews.io/register
- Groq API key: https://console.groq.com/

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd narrate
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```
   GNEWS_API_KEY=your_gnews_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

   Both keys are read server-side only (by the Express API routes), so they're never bundled into the browser JS.

4. **Start development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build   # builds the Vite client and bundles the Express server into dist/
pnpm start   # runs the production server (serves dist/public)
```

## 📖 Usage

### Landing Page

The landing page showcases Narrate's features with:
- Typewriter hero animation
- Feature highlights
- How it works section
- FAQ accordion
- Call-to-action buttons

### News Feed

- Browse articles by category (Latest, Trending, Technology, AI, Business, Science, Health, Sports, World)
- Infinite scroll for seamless browsing
- Bookmark articles for later
- Generate AI summaries on demand

### Search

- Use `/` or `Cmd+K` to open search
- Filter by country, language, category, and sort order
- Search history saved automatically

### Article Page

- Full article content
- Sticky table of contents
- AI summary panel (desktop sidebar / mobile bottom sheet)
- Bookmark and share options
- Related articles

### Bookmarks

- Organize articles into folders
- Search bookmarks
- Sort by date or title
- Delete individual or bulk

### History

- View all generated summaries
- View reading history
- Search history
- Clear all or individual entries

### Settings

- Theme toggle (light/dark)
- Default country
- Preferred category
- Reading layout (comfortable/compact)
- Font size (small/medium/large)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search bar |
| `Cmd+K` | Open search modal |
| `B` | Bookmark current article |
| `S` | Trigger AI summarize |
| `Esc` | Close any modal |

## 🎨 Design System

### Typography

- **Headings**: Playfair Display (serif) for editorial feel
- **Body**: Inter (sans-serif) for readability
- **Sizes**: Responsive scaling from mobile to desktop

### Colors

- **Light Mode**: White background, dark text
- **Dark Mode**: Dark background, light text
- **Accent**: Black/White depending on theme
- **No Gradients**: Clean, minimal aesthetic

### Components

- Rounded corners (`rounded-xl`)
- Minimal shadows (`shadow-sm`)
- Hairline borders (`border-border`)
- Smooth animations (under 600ms)

## 🔒 Privacy & Data

- **All data stored locally** in browser localStorage
- **No server-side tracking** of user activity
- **No personal information** collected or transmitted
- **API keys stored securely** in environment variables
- **Bookmarks, summaries, and history** never leave your device

## 🚦 Performance

- **Server Components** for optimal data fetching
- **Dynamic imports** for code splitting
- **Image optimization** with Next.js Image
- **Lazy loading** for off-screen content
- **Caching** with 30-minute TTL
- **Streaming** for AI summaries
- **Memoization** to prevent unnecessary re-renders

## 🧪 Development

### Code Quality

- **TypeScript strict mode** for type safety
- **ESLint** for code consistency
- **Prettier** for code formatting
- **No hardcoded strings** (all in constants)
- **Reusable components** and hooks

### Testing

```bash
pnpm check    # TypeScript check
pnpm format   # Format code
```

## 📦 Deployment

This app is a single Node.js server (Express) that serves the built Vite frontend, so it deploys well to any Node hosting platform that runs a persistent server (not a serverless-only platform).

### Railway / Render (Recommended)

1. Push code to GitHub
2. Create a new service and connect the repository
3. Set the build command to `pnpm install && pnpm build`
4. Set the start command to `pnpm start`
5. Add `GNEWS_API_KEY` and `GROQ_API_KEY` as environment variables
6. Deploy

### Other Platforms

Any host that runs a long-lived Node process works: DigitalOcean App Platform, Fly.io, AWS Elastic Beanstalk, etc. Vercel/Netlify work too, but you'll need to adapt the Express server to their serverless function format since it isn't a Next.js app.

## 🛣️ Roadmap

### Phase 1 (Current)
- ✅ Landing page with animations
- ✅ News feed with categories
- ✅ Article detail page
- ✅ AI summarization with streaming
- ✅ Bookmarks and history
- ✅ Search functionality
- ✅ Settings and preferences

### Phase 2 (Planned)
- [ ] User authentication (optional)
- [ ] Cloud sync for bookmarks
- [ ] Email digests
- [ ] Podcast summaries
- [ ] PDF export
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Collaborative reading lists
- [ ] Social sharing
- [ ] Browser extension
- [ ] API for third-party integrations

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License—see LICENSE file for details.

## 🙏 Acknowledgments

- **GNews** for news aggregation
- **Groq** for AI-powered summaries
- **Vercel** for Next.js and deployment
- **shadcn/ui** for beautiful components
- **Framer Motion** for smooth animations

## 📞 Support

- 📧 Email: support@narrate.app
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

**Built with ❤️ by the Narrate team**

*The fastest way to understand today's news.*
