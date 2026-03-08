# FIRE 🔥

Figure out when you can tell your boss goodbye — a FIRE (Financial Independence, Retire Early) calculator.

## What it does

Enter your income, expenses, assets, and liabilities to see how soon you can reach financial independence. The app calculates your savings rate, projects your investment growth, and shows your FIRE timeline.

- **Quick Start** — get a projection with just 3 numbers
- **Demo Mode** — explore with realistic sample data (Bay Area tech couple with 1 kid)
- **Full Setup** — detailed onboarding for a more accurate projection

All data is stored locally in your browser. Nothing is sent to a server.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Feedback

The app includes a floating feedback button. To enable it, create a `.env.local` file:

```
RESEND_API_KEY=your_resend_api_key
FEEDBACK_EMAIL=your_email@example.com
```

Get a free API key at [resend.com](https://resend.com).

## Deploy

Deploy to Vercel in one click — it auto-detects the Next.js setup. Add your `RESEND_API_KEY` and `FEEDBACK_EMAIL` as environment variables in the Vercel project settings.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Radix UI / shadcn/ui
- Resend (email)
