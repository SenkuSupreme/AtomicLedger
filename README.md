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
