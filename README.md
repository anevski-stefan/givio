# Givio - AI-Powered Gift Recommendation App

An AI-powered personalized gift recommendation platform built with React Native and Expo.

## Tech Stack

- **Frontend**: React Native + Expo (TypeScript)
- **Backend**: Supabase (PostgreSQL + pgvector)
- **AI**: Google Gemini Flash + Claude 3.5 Haiku
- **Vector Search**: Supabase pgvector with OpenAI embeddings
- **Trends**: Tavily API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- iOS Simulator (Mac) or Android Emulator
- Expo Go app on your phone (optional)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials
   - Add your AI API keys (Gemini, Claude, OpenAI, Tavily)

3. Start the development server:
```bash
npm start
```

4. Run on your platform:
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## Project Structure

```
givio-app/
├── app/              # App screens (Expo Router)
├── components/       # Reusable components
├── lib/             # Utility libraries (Supabase client)
├── types/           # TypeScript type definitions
├── constants/       # App constants
└── assets/          # Images, fonts, etc.
```

## Environment Variables

See `.env.example` for required environment variables.

## Development Status

Currently in **Phase 1: Project Setup & Infrastructure**

See `task.md` for detailed progress tracking.

## License

MIT
