Perfect — here’s the developer-ready Product Specification expanding on your PRD for 🎵 Melodify, your Suno-powered singing remix app.
It’s structured for immediate implementation in a Next.js 14 App Router environment, deployable on Vercel, with Supabase for storage/auth and optional Stripe monetization.

⸻

🎧 Melodify – Developer Specification

1. Architecture Overview

Stack Summary

Layer	Technology	Purpose
Frontend	Next.js 14 (App Router) + Tailwind CSS + TypeScript	UI for recording/uploading, style selection, playback
Backend	Next.js API Routes / Edge Functions (Node 18+)	Audio upload, processing, and Suno API orchestration
Audio Processing	Whisper (OpenAI Whisper API or local ffmpeg + whisper.cpp) + Demucs (optional)	Transcription, melody extraction, vocal isolation
Storage	Supabase Storage / S3-compatible bucket	Store raw & generated audio
Database	Supabase (Postgres + RLS)	Track users, generations, and credits
Auth	Supabase Auth (Magic Link / OAuth)	Secure sign-in
Payments	Stripe API	Credit packs / subscription
Deployment	Vercel (Edge + Serverless)	Fast, globally cached delivery


⸻

2. File / Folder Structure

melodify/
│
├── app/
│   ├── page.tsx                → Landing page
│   ├── record/page.tsx         → Record / upload screen
│   ├── generate/page.tsx       → Style selection + generation
│   ├── result/[id]/page.tsx    → Playback & share screen
│   └── api/
│       ├── upload/route.ts     → Handle audio uploads
│       ├── process/route.ts    → Whisper + metadata extraction
│       ├── suno/route.ts       → Suno API call + queue
│       └── webhook/stripe.ts   → Stripe event handler
│
├── components/
│   ├── Recorder.tsx
│   ├── AudioPlayer.tsx
│   ├── StyleSelector.tsx
│   ├── LoadingWave.tsx
│   └── Navbar.tsx
│
├── lib/
│   ├── supabaseClient.ts
│   ├── stripe.ts
│   ├── sunoClient.ts
│   └── whisperClient.ts
│
├── utils/
│   ├── audioUtils.ts
│   └── prompts.ts
│
├── public/
│   └── icons/ , logo.svg
│
├── .env.local
├── tailwind.config.ts
├── package.json
└── README.md


⸻

3. API Endpoints

POST /api/upload

Uploads raw or recorded audio.

// Body (multipart/form-data)
audio: File

Response:
{ success: true, fileUrl: string }

POST /api/process

Analyzes audio via Whisper.

{ fileUrl: string }

Response:
{
  transcription: string,
  key: string,
  bpm: number,
  mood: string
}

POST /api/suno

Sends user vocal + style prompt to Suno API.

{
  fileUrl: string,
  style: string,
  prompt?: string
}

Response:
{
  status: "success",
  audioUrl: string,
  metadata: { bpm: number, key: string },
  previewImage?: string
}

GET /api/result/[id]

Fetches metadata and file URLs for display.

⸻

4. UI Component Specs

🎙️ Recorder.tsx
	•	Uses MediaRecorder API
	•	Displays waveform animation while recording
	•	Buttons: Start / Stop / Upload
	•	Emits Blob → /api/upload

🎛️ StyleSelector.tsx
	•	6–8 preset cards (grid layout)
	•	Each card has icon + hover preview sample
	•	Click → set selectedStyle

🎵 LoadingWave.tsx
	•	Animated SVG bars with “Composing your track…” caption

🎧 AudioPlayer.tsx
	•	Native audio player + waveform visual
	•	Download & Share buttons (Twitter / Telegram / copy link)

⸻

5. Database Schema (Supabase)

users

Column	Type	Notes
id	uuid PK	—
email	text unique	—
credits	int default 5	Track free credits
created_at	timestamp	—

songs

Column	Type	Notes
id	uuid PK	—
user_id	uuid FK → users.id	—
input_url	text	Uploaded audio
output_url	text	Generated song
style	text	Selected style
prompt	text	Custom prompt
metadata	jsonb	BPM, key, etc.
created_at	timestamp	—

transactions

Column	Type	Notes
id	uuid PK	—
user_id	uuid FK	—
amount	int	Cents
credits_added	int	—
stripe_event_id	text	—
created_at	timestamp	—


⸻

6. Suno API Integration (Example)

// lib/sunoClient.ts
export async function generateSong(fileUrl: string, style: string, prompt?: string) {
  const res = await fetch("https://api.suno.ai/generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.SUNO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input_audio_url: fileUrl,
      style,
      prompt: prompt || `Remix vocals into a ${style} arrangement`,
    }),
  });
  return res.json();
}


⸻

7. Environment Variables (.env.local)

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

SUNO_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=


⸻

8. Generation Pipeline Sequence

User records/upload → /api/upload
     ↓
/api/process → Whisper analysis
     ↓
Select style → /api/suno
     ↓
Suno returns URL → save to Supabase → display on /result/[id]


⸻

9. UI Flow
	1.	Landing page: Hero + “Start Creating” CTA
	2.	Record/Upload: Waveform recorder → Next
	3.	Select Style: Preset grid → Generate
	4.	Generation Screen: Animated progress + messages
	5.	Result Page: Player + download/share options
	6.	(Optional) Login → View saved songs → Buy credits

⸻

10. Monetization & Limits
	•	Free users = 3–5 credits
	•	1 generation = 1 credit
	•	Stripe integration:
	•	$5 → 10 credits
	•	$15 → 30 credits
	•	Stripe webhook increments credits on invoice.payment_succeeded.

⸻

11. Future Enhancements

Feature	Description
🎙 Voice cloning	Retain singer’s tone across styles
🧠 Custom prompt mode	Allow advanced users to edit full text prompt
💬 Social sharing	Built-in “Remix Challenge” feed
🤝 Duet mode	Two uploaded vocals → harmonized track
🌈 Album art	Auto-generate cover via DALL·E prompt
📊 Analytics	Track genre popularity + conversion rates


⸻