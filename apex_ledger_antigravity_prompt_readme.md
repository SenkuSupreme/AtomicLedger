# ApexLedger — Antigravity IDE Prompt & README

## Project Name
**ApexLedger** — an all-in-one, AI-powered trade journal and backtesting platform for stocks, forex, and crypto built with Next.js and MongoDB.

---

## Purpose of this document
This document contains a single copy-and-paste-ready prompt to paste into **Antigravity IDE** (or a similar code-generation assistant) to generate a fully functional Next.js + MongoDB application with integrated AI features using free OpenRouter-compatible models. It also contains a ready-to-use `README.md` tailored for the generated project.

---

## Antigravity IDE Prompt (Paste this entire section into Antigravity)

```
You are an expert full-stack engineer. Generate a complete, production-ready Next.js application named **ApexLedger** with the following requirements. Output a repository structure, all required files and code (React components, API routes, database models, and basic tests). Provide clear inline comments and a small example dataset for local testing.

**High-level overview**
- Purpose: Trade journal + backtesting platform for stocks, forex, and crypto with AI-powered analysis (tagging, sentiment, pattern recognition, strategy scoring, entry/exit suggestions) using free OpenRouter-compatible APIs.
- Tech stack: Next.js (latest stable), React, MongoDB (Mongoose or MongoDB native driver), NextAuth for authentication, Tailwind CSS (or Chakra UI) for styling, Chart.js or Recharts for charts, Node cron (or serverless function trigger) for scheduled jobs, Jest + React Testing Library for tests.

**Functional Requirements**
1. Authentication
   - NextAuth with Email+Password (credentials provider) and option to enable OAuth providers later.
   - Protect all pages containing user data.

2. Database Models (Mongoose preferred)
   - User: `{ _id, email, name, hashedPassword, createdAt, settings }`.
   - Trade: `{ _id, userId, symbol, assetType, exchange, timestampEntry, timestampExit, entryPrice, exitPrice, quantity, direction, fees, pnl, pnlCurrency, rMultiple, tags: [], notes, strategyId (optional), inBacktest: Boolean, createdAt, aiAnalysis: {...} }`.
   - Strategy: `{ _id, userId, name, description, rules (JSON), tags, createdAt }`.
   - Backtest: `{ _id, userId, strategyId, asset, timeframe, parameters, results (JSON), createdAt }`.
   - Tag: `{ _id, userId, name, color, description }`.

3. Core Pages & Components
   - Dashboard: summary metrics (total P/L, win rate, profit factor, max drawdown, equity curve), top strategies, recent trades, AI insights summary.
   - Journal: trade entry form (manual and CSV import), editable trade list, filters (date range, asset type, tags, strategy, P/L range), export CSV, calendar heatmap view.
   - Trade Detail: full trade record, notes, attached tags, AI analysis panel (sentiment, suggested tags, pattern recognition, confidence score), trade edit.
   - Backtester: create strategy UI (JSON rules + builder), fetch historical price data (free sources), run backtest, visualize equity curve, compute metrics; option to import backtest trades into journal with `inBacktest` flag.
   - Strategies: CRUD for user strategies, strategy performance page (metrics and AI evaluation report).
   - Settings: account, API keys (OpenRouter), data source preferences, account currency, risk settings.

4. Backtesting Engine
   - Use free historical price providers: suggest usage of Alpha Vantage (stocks/forex), Yahoo Finance (via yfinance-like endpoints), and CoinGecko (crypto). Implement an adapter pattern so data sources can be swapped.
   - Implement a simple rule engine that accepts JSON rules (e.g., entries based on indicators: SMA crossover, RSI oversold/overbought, price action conditions). Include sample indicators: SMA, EMA, RSI, ATR.
   - Backtest should simulate position sizing, slippage, and commission. Compute metrics: total return, CAGR, max drawdown, win rate, profit factor, expectancy, R-Multiple distribution.
   - Provide a replay mode: step through candles and optionally create journal entries from simulated trades.

5. AI Integrations (OpenRouter-compatible)
   - Centralize AI calls inside `/lib/ai.js` (or similar). Read API key from environment variable `OPENROUTER_API_KEY`.
   - Implement backend routes that call the AI and sanitize/limit what is sent:
     - `POST /api/ai/suggest-tags` — input: trade summary + notes => output: suggested tags with confidence.
     - `POST /api/ai/sentiment` — input: notes => output: sentiment label, emotion keywords, stress indicators.
     - `POST /api/ai/evaluate-strategy` — input: strategy summary + aggregated metrics => output: AI evaluation and score (0-100), improvement suggestions.
     - `POST /api/ai/suggest-entry-exit` — input: asset, timeframe, recent price history snippet => output: entry/exit criteria and rationale.
     - `POST /api/ai/patterns` — input: aggregated trades & notes => output: recurring patterns, behavioral issues, and prioritized fixes.
   - For each route, implement rate-limiting and retry/backoff logic. Persist AI responses to the associated record (trade.aiAnalysis or strategy.aiReport).

6. Trade Import/Export
   - CSV import for trades (map columns), with a preview & mapping UI.
   - Broker integrations skeletons (CSV adapters for Interactive Brokers, MetaTrader, Binance) and clear documentation on how to extend.
   - Export trades as CSV and PDF summary.

7. Metrics & Analytics
   - Implement analytics computations server-side (API route) and cache results for a short period.
   - Metrics: equity curve, cumulative P/L, drawdowns, rolling win rate, average trade duration, distribution of R-Multiples, P/L by symbol, P/L by strategy.
   - Use Chart.js or Recharts components for charts; include responsive layout.

8. Tagging & Rule Checking
   - Trade entry UI must include manual tags and a toggle to run `suggest-tags` AI endpoint to auto-suggest.
   - Implement a trade rules checklist on each entry (did you follow plan? risk per trade?) and allow the user to check off rules; store outcomes.

9. Scheduling & Background Jobs
   - Implement a secure API route that triggers a background analysis job (e.g., `POST /api/jobs/run-daily-analysis`) to run pattern detection and re-evaluate strategies.
   - Provide sample Node cron implementation (for server environments) and instructions for scheduling via Vercel cron or external scheduler.

10. Environment & Security
    - Use `.env.local` for local env and `.env.production` for production values.
    - Required env variables: `MONGODB_URI`, `NEXTAUTH_SECRET`, `OPENROUTER_API_KEY`, `NEXT_PUBLIC_APP_URL`, `DATA_PROVIDER_API_KEYS...`.
    - Sanitize all user inputs and rate-limit endpoints that call external AI APIs. Do not log API keys.

11. Tests
    - Provide basic unit tests for database models and API routes and at least one integration test for the AI wrapper (mocked) and one React component test.

12. Deployment
    - Provide deployment config for Vercel and instructions to use MongoDB Atlas. Include a `vercel.json` if needed for serverless functions.

**Developer Notes and Constraints**
- Keep AI calls server-side; do not call AI from the browser.
- Use TypeScript in both server and client code.
- Use feature flags for experimental AI features.
- Make the project modular and well-documented.

**Deliverables**
1. Full repository with code, `package.json`, `tsconfig.json`, `.eslintrc`, Tailwind config, etc.
2. A `README.md` with setup, run, and deploy instructions (include example .env file template).
3. Seed data script to create a demo user and 20 sample trades across stocks, forex and crypto.
4. Example Postman collection or HTTP examples for main API endpoints.
5. Unit and integration tests.

Generate the code and files now. Ensure the content is ready-to-run, with clear comments and the `README.md` attached. End of prompt.
```

---

## README.md (for repository root)

Below is a ready-to-use `README.md` you can drop into the generated repo. Copy it as-is into `README.md`.

```
# ApexLedger

ApexLedger is an AI-augmented trade journal and backtesting platform that supports stocks, forex, and crypto. Built with Next.js, MongoDB, and OpenRouter-compatible LLMs for AI-powered tagging, sentiment analysis, strategy evaluation and entry/exit suggestions.

## Features
- Complete trade journal (manual entry, CSV import, broker adapters)
- Multi-asset support: stocks, forex, crypto
- Advanced backtesting engine with replay and import to journal
- Performance analytics: equity curve, drawdown, win rate, profit factor, R-Multiple distribution
- AI features powered by OpenRouter-compatible models: automated tagging, sentiment analysis, pattern detection, strategy scoring, entry/exit suggestions
- Strategy management and templates
- Secure authentication (NextAuth)

## Quickstart (local)
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd apexledger
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Environment variables
   Create a `.env.local` with the following variables:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/apexledger?retryWrites=true&w=majority
   NEXTAUTH_SECRET=<a-strong-random-secret>
   OPENROUTER_API_KEY=<your-openrouter-api-key>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DATA_PROVIDER_API_KEYS=<optional: comma-separated>
   ```

4. Seed demo data (optional):
   ```bash
   npm run seed
   ```

5. Run the dev server:
   ```bash
   npm run dev
   # visit http://localhost:3000
   ```

## Deployment
- Recommended: Vercel for Next.js front-end and serverless functions. Use MongoDB Atlas for production DB.
- Store secrets in Vercel environment variables (MONGODB_URI, NEXTAUTH_SECRET, OPENROUTER_API_KEY).

## AI Integration
- ApexLedger centralizes AI calls server-side via `/lib/ai.ts`. The app expects an OpenRouter-compatible API key. Use free model access where possible; watch for rate limits and consider caching common prompts.

## Data Sources
- The project includes adapters for free data sources (Alpha Vantage, Yahoo Finance, CoinGecko). Replace or extend adapters as required.

## Security & Privacy
- All AI calls are performed server-side. Users must add their own OpenRouter API key in settings to enable AI features.
- Do not commit `.env` files or keys to version control.

## Contributing
Contributions are welcome. Please open issues or pull requests and follow the code style and testing guidelines.

## License
MIT
```

---

## What I created here
I prepared a production-oriented Antigravity IDE prompt and a ready-to-use `README.md` for a project named **ApexLedger**. Paste the Antigravity prompt (above) into Antigravity IDE to generate the application skeleton and source files automatically. The README is included for the repository root.

If you want, I can now:
- generate a narrower prompt that outputs only the database models and API routes, or
- produce the initial code files directly here (e.g., `models/Trade.ts`, `pages/api/ai/suggest-tags.ts`, `pages/journal/index.tsx`) — tell me which subset you want and I will produce them next.

