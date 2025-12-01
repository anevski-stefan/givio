# Givio - AI-Powered Gift Recommendation App
## Implementation Plan & Architecture Guide

### 1. Project Overview
**Givio** is a mobile application designed to solve "gift-giving anxiety" by using AI to generate personalized gift recommendations. It leverages user data (wishlists, surveys) and real-time market trends to suggest the perfect gift.

**Core Value Proposition:**
- **Personalized:** Recommendations based on specific recipient profiles.
- **Trend-Aware:** Uses live web search to find what's *actually* popular right now (e.g., "Best tech gifts 2024").
- **Stress-Free:** Simple, beautiful UI to manage recipients and occasions.

---

### 2. The "Indie Super-Stack" (Best Practice 2025)
We are using a **Serverless, AI-Native** stack that maximizes speed and minimizes maintenance.

| Component | Technology | Version / Note |
| :--- | :--- | :--- |
| **Mobile Framework** | **Expo (Managed)** | SDK 52+ (React Native 0.76) |
| **Language** | **TypeScript** | Strict mode enabled |
| **Backend / DB** | **Supabase** | PostgreSQL + Auth + Realtime |
| **AI Logic** | **Supabase Edge Functions** | Deno Runtime (TypeScript) |
| **Styling** | **NativeWind v4** | Tailwind CSS for React Native |
| **Navigation** | **Expo Router** | File-based routing (like Next.js) |
| **AI Models** | **Gemini Pro + OpenAI GPT-4o** | Two-stage pipeline (Brainstorming -> Refinement) |
| **Web Search** | **Tavily API** | For fetching real-time trends |

---

### 3. Architecture & Data Flow

```mermaid
graph TD
    User[Mobile App (Expo)] -->|Auth & Data| Supabase[Supabase (Postgres)]
    User -->|Push Token| Supabase
    User -->|Request Gift Idea| Edge[Edge Function: recommend-gift]
    
    Edge -->|1. Search Trends| Tavily[Tavily Search API]
    Edge -->|2. Fetch Profile| Supabase
    Edge -->|3. Brainstorm Ideas| Gemini[Google Gemini Pro]
    Gemini -->|Raw Concepts| Edge
    Edge -->|4. Refine & Select| OpenAI[OpenAI GPT-4o]
    
    OpenAI -->|JSON Recommendation| Edge
    Edge -->|Gift Ideas| User
    
    Supabase -->|Cron Job: Check Birthdays| Cloud[Cloud Task]
    Cloud -->|Send Notification| ExpoPush[Expo Push Service]
    ExpoPush -->|Wake Up| User
```

---

### 4. Database Schema (PostgreSQL)

Run this SQL in your Supabase SQL Editor to set up the foundation.

```sql
-- Enable Vector extension for future AI similarity search
create extension if not exists vector;

-- 1. Users Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  expo_push_token text, -- For notifications
  created_at timestamptz default now()
);

-- 2. Recipients (People you buy gifts for)
create table public.recipients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  relation text, -- e.g., "Mom", "Partner"
  interests text[], -- e.g., ["Gardening", "Tech"]
  birth_date date,
  created_at timestamptz default now()
);

-- 3. Occasions (Events to buy gifts for)
create table public.occasions (
  id uuid default gen_random_uuid() primary key,
  recipient_id uuid references public.recipients(id) not null,
  title text not null, -- e.g., "Mom's 50th Birthday"
  date date not null,
  is_recurring boolean default true, -- Yearly?
  budget_min integer,
  budget_max integer,
  status text default 'upcoming' -- upcoming, completed
);

-- 4. Gift Ideas (AI Generated or Manual)
create table public.gift_ideas (
  id uuid default gen_random_uuid() primary key,
  occasion_id uuid references public.occasions(id) not null,
  title text not null,
  description text,
  price_range text,
  purchase_link text,
  ai_reasoning text, -- Why AI picked this
  is_selected boolean default false,
  created_at timestamptz default now()
);
```

---

### 5. AI "Brain" Implementation (Edge Function)

This is the critical piece. We don't just ask GPT; we **search** first.

**File:** `supabase/functions/recommend-gift/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.20.1";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"));
const TAVILY_KEY = Deno.env.get("TAVILY_API_KEY");

serve(async (req) => {
  const { recipientProfile, occasion } = await req.json();

  // Step 1: Search for current trends relevant to the user
  const query = `Best ${recipientProfile.interests.join(" ")} gifts trends 2025`;
  const searchResponse = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: TAVILY_KEY, query, include_answer: true }),
  });
  const searchData = await searchResponse.json();
  const trendsContext = searchData.answer || searchData.results[0].content;

  // Step 2: Gemini - Broad Brainstorming (Stage 1)
  // Gemini is great at ingesting large context and generating diverse ideas.
  const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
  const geminiPrompt = `
    You are a creative gift strategist.
    Recipient: ${recipientProfile.name} (${recipientProfile.relation}).
    Interests: ${recipientProfile.interests.join(", ")}.
    Occasion: ${occasion.title} (Budget: $${occasion.budget_max}).
    
    TRENDS: ${trendsContext}
    
    Task: Generate 10 unique, creative, and specific gift concepts. 
    Focus on variety. Do not worry about formatting, just list them with brief reasoning.
  `;
  const geminiResult = await geminiModel.generateContent(geminiPrompt);
  const rawIdeas = geminiResult.response.text();

  // Step 3: OpenAI - Refinement & Selection (Stage 2)
  // OpenAI is excellent at following strict JSON schemas and curation.
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are Givio, an expert gift concierge.
        I will provide a list of raw gift concepts generated by another AI.
        Your task:
        1. Select the top 3 BEST options from the list.
        2. Refine them to be specific, buyable items.
        3. Return strict JSON format: [{ title, description, price_estimate, reasoning }]`
      },
      {
        role: "user",
        content: `RAW CONCEPTS:
        ${rawIdeas}
        
        TREND CONTEXT (for reference):
        ${trendsContext}`
      }
    ],
    response_format: { type: "json_object" }
  });

  return new Response(completion.choices[0].message.content, {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### 6. Step-by-Step Implementation Workflow

#### Phase 1: Setup & Foundation
1.  **Initialize App:**
    ```bash
    npx create-expo-app@latest givio --template default
    cd givio
    ```
2.  **Install NativeWind (Styling):**
    ```bash
    npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
    npx tailwindcss init
    ```
    *Configure `tailwind.config.js` and `babel.config.js` specifically for NativeWind v4.*
3.  **Install Supabase Client:**
    ```bash
    npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
    ```

#### Phase 2: Core Features (Frontend)
1.  **Auth Screens:** Login/Signup using Supabase Auth.
2.  **Dashboard:** List of "Upcoming Occasions" (fetched from Supabase).
3.  **Recipient Profile:** Form to add Name, Relation, Interests.
4.  **Gift Generation UI:**
    *   A "Magic Button" that calls the `recommend-gift` Edge Function.
    *   A loading state (skeleton screen) while AI thinks.
    *   A card view to display the 3 suggestions.

#### Phase 3: Notifications & Polish
1.  **Push Notifications:**
    *   Install `expo-notifications`.
    *   Add logic to `App.tsx` to request permission on launch.
    *   Save token to `profiles` table.
2.  **Cron Job (Supabase):**
    *   Enable `pg_cron` extension in Supabase Dashboard.
    *   Create a SQL cron job that runs daily at 9 AM to check for birthdays `current_date + interval '3 days'`.

---

### 7. Recommended Project Structure

```
givio/
├── app/                    # Expo Router (Pages)
│   ├── (auth)/             # Login/Signup group
│   ├── (tabs)/             # Main App Tabs
│   │   ├── index.tsx       # Dashboard
│   │   ├── recipients.tsx  # People List
│   │   └── profile.tsx     # User Settings
│   ├── occasion/
│   │   └── [id].tsx        # Specific Event Details
│   └── _layout.tsx         # Root Layout
├── components/             # Reusable UI
│   ├── ui/                 # Buttons, Inputs (Design System)
│   ├── GiftCard.tsx
│   └── OccasionRow.tsx
├── lib/
│   ├── supabase.ts         # Supabase Client Init
│   └── api.ts              # Edge Function wrappers
├── assets/                 # Images/Fonts
└── supabase/               # Backend Logic
    ├── functions/          # Edge Functions
    └── migrations/         # SQL Schema
```
